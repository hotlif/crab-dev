import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { AsyncLocalStorage } from "node:async_hooks";
import path from "node:path";
import { repositoryRoot, readLibraryMetadata } from "../../../scripts/library-manifest.mjs";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const printer = ts.createPrinter({ removeComments: true });
const options = { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX,
    strict: true, noEmit: true, skipLibCheck: true, esModuleInterop: true, types: [] };
const contexts = new Map();
const batches = new AsyncLocalStorage();

/** One source program per generation; subsequent watches start fresh. */
export function withApiSourceBatch(work) {
    const manifest = readLibraryMetadata();
    return batches.run({ manifest, metadata: JSON.stringify(manifest), contexts: new Map() }, work);
}

export function normalizeCommentText(value) {
    return typeof value === "string" ? value.replace(/\{@link\s+([^}\s]+)(?:\s+([^}]*))?\}/g, (_, target, label) => label?.trim() || target).replace(/\s+/g, " ").trim() : "";
}

function leadingLineComment(declaration) {
    const file = declaration.getSourceFile();
    const comments = [];
    let end = declaration.getStart(file);
    while (end > 0) {
        const start = file.text.lastIndexOf("\n", end - 1);
        const line = file.text.slice(start + 1, end).trim();
        end = Math.max(0, start);
        if (!line) { if (!comments.length) continue; break; }
        if (!line.startsWith("//")) break;
        const comment = line.slice(2).trim();
        if (!/^[-=─\s]+$/.test(comment)) comments.unshift(comment);
    }
    return normalizeCommentText(comments.join(" "));
}

function createProgram(roots, manifest) {
    const host = ts.createCompilerHost(options, true);
    // Authoritative workspace types come from source, not stale build declarations.
    const packages = new Map(manifest.packages.map(entry => [entry.name, entry.path]));
    host.resolveModuleNames = (names, containingFile) => names.map(name => {
        const parts = name.split("/"), directory = packages.get(parts.slice(0, 2).join("/"));
        if (directory) {
            const stem = path.join(repositoryRoot, directory, "src", parts.slice(2).join("/") || "index");
            for (const [suffix, extension] of [[".ts", ts.Extension.Ts], [".tsx", ts.Extension.Tsx], ["/index.ts", ts.Extension.Ts]]) {
                if (existsSync(stem + suffix)) return { resolvedFileName: stem + suffix, extension };
            }
        }
        const resolved = ts.resolveModuleName(name, containingFile, options, host).resolvedModule;
        // Temporary contract fixtures still use the website's declared React types.
        return resolved ?? ts.resolveModuleName(name, path.join(repositoryRoot, ".website/api-source-host.ts"), options, host).resolvedModule;
    });
    return ts.createProgram(roots, options, host);
}

function current(context, metadata) {
    return context?.metadata === metadata && context.program.getSourceFiles().every(file => ts.sys.readFile(file.fileName) === file.text);
}

function programFor(sourcePath) {
    const batch = batches.getStore();
    const manifest = batch?.manifest ?? readLibraryMetadata(), metadata = batch?.metadata ?? JSON.stringify(manifest);
    const owner = manifest.packages.find(entry => sourcePath.startsWith(path.resolve(repositoryRoot, entry.path) + path.sep));
    const key = batch ? "library" : owner?.path ?? sourcePath, cache = batch?.contexts ?? contexts, context = cache.get(key);
    const source = context?.program.getSourceFile(sourcePath);
    if (source && source.text === ts.sys.readFile(sourcePath) && (batch ? context.metadata === metadata : current(context, metadata))) {
        cache.delete(key); cache.set(key, context);
        return context.program;
    }
    const entries = batch ? manifest.packages.map(entry => path.resolve(repositoryRoot, entry.path, "src/index.ts"))
        : owner ? [path.resolve(repositoryRoot, owner.path, "src/index.ts")] : [];
    const roots = [...new Set([...(context?.roots ?? []), ...entries.filter(existsSync), sourcePath])];
    const next = { metadata, program: createProgram(roots, manifest) };
    next.roots = roots;
    cache.delete(key); cache.set(key, next);
    if (cache.size > 3) cache.delete(cache.keys().next().value);
    return next.program;
}

function orderedProperties(type, checker, seen = new Set()) {
    if (seen.has(type)) return [];
    seen.add(type);
    const own = checker.getPropertiesOfType(type);
    const inherited = type.getBaseTypes?.()?.flatMap(base => orderedProperties(base, checker, seen)) ?? [];
    const byName = new Map(own.map(property => [property.name, property]));
    const order = [...new Set([...inherited, ...own].map(property => property.name))];
    return order.map(name => byName.get(name)).filter(Boolean);
}

function propertyTypeText(property, checker, location) {
    const declaration = property.valueDeclaration ?? property.declarations?.[0];
    if (declaration?.type?.kind === ts.SyntaxKind.NeverKeyword) return "never";
    const type = checker.getTypeOfSymbolAtLocation(property, location);
    if (declaration?.type && ts.isPropertySignature(declaration)) {
        let generic = false;
        function visit(node) {
            if (ts.isTypeReferenceNode(node) && checker.getTypeAtLocation(node).flags & ts.TypeFlags.TypeParameter) generic = true;
            ts.forEachChild(node, visit);
        }
        visit(declaration.type);
        // Preserve authored aliases and syntax when no generic substitution is needed.
        if (!generic || checker.getTypeFromTypeNode(declaration.type) === type) {
            return printer.printNode(ts.EmitHint.Unspecified, declaration.type, declaration.getSourceFile()).replace(/\s+/g, " ").trim();
        }
    }
    let flags = ts.NodeBuilderFlags.NoTruncation | ts.NodeBuilderFlags.UseAliasDefinedOutsideCurrentScope;
    if (declaration?.type && checker.getTypeAtLocation(declaration.type).flags & ts.TypeFlags.TypeParameter) flags |= ts.NodeBuilderFlags.WriteArrayAsGenericType;
    let node = checker.typeToTypeNode(type, declaration ?? location, flags);
    if (node && ts.isUnionTypeNode(node) && property.flags & ts.SymbolFlags.Optional) {
        const types = node.types.filter(item => item.kind !== ts.SyntaxKind.UndefinedKeyword);
        if (types.length) node = types.length === 1 ? types[0] : ts.factory.createUnionTypeNode(types);
    }
    return node ? printer.printNode(ts.EmitHint.Unspecified, node, location.getSourceFile()).replace(/\s+/g, " ").trim() : "unknown";
}

function mergeUnionRecords(groups) {
    const maps = groups.map(records => new Map(records.map(record => [record.name, record])));
    const names = [...new Set(groups.flatMap(records => records.map(record => record.name)))];
    const absent = record => record?.typeText === "never" || record?.required === false && record.typeText === "undefined";
    return names.map(name => {
        const variants = maps.map(group => group.get(name)).filter(Boolean);
        const concrete = variants.filter(record => !absent(record));
        const types = [...new Set(concrete.map(record => record.typeText))];
        const exclusives = names.filter(other => other !== name && maps.some(group => absent(group.get(other)))
            && maps.some(group => group.has(other) && !absent(group.get(other)))
            && maps.filter(group => group.has(name) && !absent(group.get(name))).every(group => absent(group.get(other))));
        return { name, required: maps.every(group => group.get(name)?.required),
            description: variants.find(record => record.description)?.description ?? "",
            typeText: types.map(text => types.length > 1 && text.includes("=>") ? `(${text})` : text).join(" | ") || (variants.some(record => record.typeText === "undefined") ? "undefined" : "never"),
            defaultValue: null, deprecated: variants.some(record => record.deprecated),
            native: variants.every(record => record.native), exclusiveWith: [...new Set([...variants.flatMap(record => record.exclusiveWith ?? []), ...exclusives])] };
    });
}

function mergeIntersectionRecords(groups) {
    const merged = new Map();
    for (const records of groups) for (const record of records) {
        const before = merged.get(record.name);
        merged.set(record.name, before ? { ...before,
            required: before.required || record.required,
            description: before.description || record.description,
            typeText: before.typeText === record.typeText ? before.typeText : `(${before.typeText}) & (${record.typeText})`,
            deprecated: before.deprecated || record.deprecated,
            native: before.native && record.native,
            exclusiveWith: [...new Set([...(before.exclusiveWith ?? []), ...(record.exclusiveWith ?? [])])],
        } : record);
    }
    return [...merged.values()];
}

/** The official checker resolves aliases, mapped types, generics and inheritance. */
export function parseSourceApiProps(sourcePath, name) {
    const absolute = path.resolve(sourcePath);
    if (!existsSync(absolute)) return [];
    const program = programFor(absolute), checker = program.getTypeChecker(), source = program.getSourceFile(absolute);
    let symbol = checker.getSymbolsInScope(source, ts.SymbolFlags.Type | ts.SymbolFlags.Alias).find(item => item.name === name);
    if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    if (!symbol) return [];
    symbol = checker.getExportSymbolOfSymbol(symbol);
    function records(type) {
        if (type.isUnion()) return mergeUnionRecords(type.types.map(records));
        return orderedProperties(type, checker).map(property => {
            const declarations = property.declarations ?? [];
            return { name: property.name, required: !(property.flags & ts.SymbolFlags.Optional),
                description: normalizeCommentText(ts.displayPartsToString(property.getDocumentationComment(checker))) || (declarations[0] ? leadingLineComment(declarations[0]) : ""),
                typeText: propertyTypeText(property, checker, source), defaultValue: null,
                deprecated: property.getJsDocTags(checker).some(tag => tag.name === "deprecated"),
                native: declarations.length > 0 && declarations.every(declaration => declaration.getSourceFile().fileName.replaceAll("\\", "/").includes("/@types/react/")),
            };
        });
    }
    const resolving = new Set();
    function recordsForNode(node) {
        if (ts.isParenthesizedTypeNode(node)) return recordsForNode(node.type);
        if (ts.isIntersectionTypeNode(node)) return mergeIntersectionRecords(node.types.map(recordsForNode));
        if (ts.isUnionTypeNode(node)) return mergeUnionRecords(node.types.map(recordsForNode));
        if (ts.isTypeReferenceNode(node)) {
            let target = checker.getSymbolAtLocation(node.typeName);
            if (target?.flags & ts.SymbolFlags.Alias) target = checker.getAliasedSymbol(target);
            if (target) target = checker.getExportSymbolOfSymbol(target);
            const alias = target?.declarations?.find(ts.isTypeAliasDeclaration);
            if (alias && !alias.typeParameters?.length && !resolving.has(alias)) {
                resolving.add(alias);
                try { return recordsForNode(alias.type); }
                finally { resolving.delete(alias); }
            }
        }
        return records(checker.getTypeFromTypeNode(node));
    }
    // Preserve source composition when presenting unions of independent state
    // protocols. Asking the checker for their distributed product creates 2^N
    // branches; leaf instantiation still belongs entirely to the checker.
    const alias = symbol.declarations?.find(ts.isTypeAliasDeclaration);
    return alias ? recordsForNode(alias.type) : records(checker.getDeclaredTypeOfSymbol(symbol));
}
