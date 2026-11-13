import { css } from '@crab-dev/css';
import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import { TokenVars as lineEditVars } from '@crab-dev/rc-line-edit';
import { TokenVars as selectVars } from '@crab-dev/rc-select';
import { TokenVars as splitPaneVars } from '@crab-dev/rc-split-pane';
import { TokenVars as tableVars } from '@crab-dev/rc-table';
import { TokenVars as textEditVars } from '@crab-dev/rc-text-edit';
import { TokenVars as treeVars } from '@crab-dev/rc-tree';
import palette from '@crab-dev/rc-token-global';
import token from '@crab-dev/rc-token-semantic';

// Page-local material study. Keep the data canvas opaque and use only one
// backdrop surface per functional region; do not change the shared macOS theme
// until this workspace has been visually reviewed.
// https://developer.apple.com/videos/play/wwdc2025/310/
export const tahoeWorkspace = css`
    & > [data-workspace-part="backdrop"] { display: none; }
    &[data-workspace-design="macos"] {
        --engineering-canvas: color-mix(in oklch, ${token.color.workspace.content} 97%, ${token.color.workspace.frame});
        --engineering-glass-fill: ${token.color.surface.overlay};
        --engineering-inspector-fill: ${token.color.workspace.sidebar};
        --engineering-command-fill: ${token.color.surface.raised};
        --engineering-glass-filter: none;
        --engineering-inspector-filter: none;
        --engineering-command-filter: none;
        --engineering-ambient-opacity: 1;
        --engineering-rim-opacity: 1;
        --engineering-ambient-base: ${palette.white};
        --engineering-ambient-cool: color-mix(in oklab, ${palette.blue[300]} 56%, ${palette.zinc[100]});
        --engineering-ambient-tide: color-mix(in oklab, ${palette.blue[200]} 80%, ${palette.green[100]});
        --engineering-ambient-warm: color-mix(in oklab, ${palette.amber[200]} 36%, ${palette.zinc[100]});
        --engineering-ambient-haze: color-mix(in oklab, ${palette.blue[200]} 55%, ${palette.zinc[50]});
        --engineering-edge: color-mix(in oklch, ${token.color.text.primary} 12%, transparent);
        --engineering-reflection: color-mix(in oklch, ${palette.white} 86%, transparent);
        --engineering-shadow: color-mix(in oklch, ${palette.black} 10%, transparent);
        --engineering-field-fill: color-mix(in oklch, ${token.color.surface.content} 56%, transparent);
        --engineering-field-border: color-mix(in oklch, ${token.color.text.primary} 22%, transparent);

        position: relative; z-index: 0;
        background-color: var(--engineering-canvas); background-image: none;
        ${splitPaneVars['separator.line.background-color']}: transparent;

        /* The browser cannot sample the OS desktop. This continuous ambient
           canvas supplies the actual pixels behind the functional glass;
           the opaque table covers it. Never duplicate data text as a backdrop. */
        & > [data-workspace-part="backdrop"] {
            display: block; position: absolute; inset: 0; min-width: 1120px;
            z-index: 0; pointer-events: none; opacity: var(--engineering-ambient-opacity);
            background-color: var(--engineering-ambient-base);
            background-image:
                radial-gradient(ellipse 38% 78% at -8% 30%, var(--engineering-ambient-cool), transparent 82%),
                radial-gradient(ellipse 42% 60% at 3% 105%, var(--engineering-ambient-tide), transparent 78%),
                radial-gradient(ellipse 52% 90% at 96% 16%, var(--engineering-ambient-haze), transparent 84%),
                radial-gradient(ellipse 48% 72% at 98% 100%, var(--engineering-ambient-warm), transparent 82%);
        }
        & > [data-workspace-part="window-header"],
        & > [data-workspace-part="navigation"] { position: relative; z-index: 1; }

        &[data-workspace-mode="dark"] {
            --engineering-canvas: color-mix(in oklch, ${palette.zinc[900]} 92%, ${palette.zinc[800]});
            --engineering-ambient-base: ${palette.zinc[900]};
            --engineering-ambient-cool: color-mix(in oklab, ${palette.blue[800]} 52%, ${palette.zinc[800]});
            --engineering-ambient-tide: color-mix(in oklab, color-mix(in oklab, ${palette.blue[800]} 55%, ${palette.green[900]}) 60%, ${palette.zinc[800]});
            --engineering-ambient-warm: color-mix(in oklab, ${palette.amber[800]} 32%, ${palette.zinc[800]});
            --engineering-ambient-haze: color-mix(in oklab, ${palette.blue[800]} 40%, ${palette.zinc[800]});
            --engineering-reflection: color-mix(in oklch, ${palette.white} 32%, transparent);
            --engineering-shadow: color-mix(in oklch, ${palette.black} 28%, transparent);
            --engineering-field-fill: color-mix(in oklch, ${palette.white} 6%, transparent);
            --engineering-field-border: color-mix(in oklch, ${palette.white} 20%, transparent);
        }

        @supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
            --engineering-glass-filter: blur(20px) saturate(1.45);
            --engineering-inspector-filter: blur(24px) saturate(1.3);
            --engineering-command-filter: blur(16px) saturate(1.5);
            --engineering-glass-fill: color-mix(in oklch, ${palette.white} 44%, transparent);
            --engineering-inspector-fill: color-mix(in oklch, ${palette.white} 50%, transparent);
            --engineering-command-fill: color-mix(in oklch, ${palette.white} 30%, transparent);
            &[data-workspace-mode="dark"] {
                --engineering-glass-fill: color-mix(in oklch, ${palette.zinc[100]} 8%, transparent);
                --engineering-inspector-fill: color-mix(in oklch, ${palette.zinc[100]} 5%, transparent);
                --engineering-command-fill: color-mix(in oklch, ${palette.zinc[100]} 10%, transparent);
            }
        }

        & [data-workspace-part="window-header"] {
            padding: 12px 20px 10px; min-height: 32px;
        }
        & [data-workspace-part="app-icon"] {
            background: transparent; border: 0; width: 24px; height: 24px;
            color: ${token.color.text.secondary};
        }
        & [data-workspace-part="navigation"] { padding-inline: 12px; }
        & [data-workspace-part="sidebar-inset"] { padding: 8px 10px 10px 2px; }
        & [data-workspace-part="sidebar"] {
            position: relative;
            background-color: var(--engineering-glass-fill);
            background-image: linear-gradient(135deg,
                color-mix(in oklch, var(--engineering-reflection) 22%, transparent), transparent 38%,
                color-mix(in oklch, var(--engineering-reflection) 6%, transparent));
            backdrop-filter: var(--engineering-glass-filter);
            -webkit-backdrop-filter: var(--engineering-glass-filter);
            border: 1px solid var(--engineering-edge); border-radius: 16px;
            box-shadow: inset 0 1px 0 var(--engineering-reflection),
                inset 0 -1px 0 color-mix(in oklch, var(--engineering-reflection) 30%, transparent),
                0 12px 24px -14px var(--engineering-shadow), 0 3px 8px var(--engineering-shadow);
            padding: 8px 6px;
            ${treeVars['node.background-color-selected']}: color-mix(in oklch, ${token.color.text.primary} 9%, transparent);
            ${treeVars['node.color-selected']}: ${token.color.text.primary};
            ${treeVars['root.border-radius']}: 7px;
            &:focus-within {
                ${treeVars['node.background-color-selected']}: ${token.color.brand.primary};
                ${treeVars['node.color-selected']}: ${token.color.text['on-brand']};
            }
        }
        & [data-workspace-part="content"] {
            background: transparent; border-radius: 0;
        }
        & [data-workspace-part="toolbar"] {
            padding: 8px 16px; min-height: 34px;
        }
        & [data-workspace-part="commands"] {
            position: relative;
            border-radius: 12px; gap: 2px; padding: 3px;
            background: linear-gradient(150deg, color-mix(in oklch, var(--engineering-reflection) 12%, transparent), transparent 55%), var(--engineering-command-fill);
            backdrop-filter: var(--engineering-command-filter);
            -webkit-backdrop-filter: var(--engineering-command-filter);
            border: 1px solid var(--engineering-edge);
            box-shadow: inset 0 1px 0 var(--engineering-reflection), 0 2px 4px var(--engineering-shadow);
            ${buttonVars['macos.control.border-radius']}: 9px;
        }
        & [data-workspace-part="sidebar"]::after,
        & [data-workspace-part="commands"]::after {
            content: ''; position: absolute; inset: -1px; pointer-events: none;
            border: 1px solid transparent; border-radius: inherit;
            background: linear-gradient(145deg, var(--engineering-reflection),
                transparent 35%, color-mix(in oklch, var(--engineering-reflection) 55%, transparent) 78%, transparent) border-box;
            mask: linear-gradient(${palette.white} 0 0) padding-box, linear-gradient(${palette.white} 0 0);
            mask-composite: exclude; opacity: var(--engineering-rim-opacity);
        }
        & [data-workspace-part="create"] { ${buttonVars['macos.plain.color']}: ${token.color.text.link}; }
        & [data-workspace-part="filters"] {
            grid-template-columns: minmax(180px, 280px) 122px auto;
            padding: 0 16px 10px;
            border-bottom: 0;
            ${lineEditVars['root.background-color']}: var(--engineering-field-fill);
            ${lineEditVars['root.border-color']}: var(--engineering-field-border);
            ${lineEditVars['root.box-shadow']}: none;
            ${selectVars['root.background-color']}: var(--engineering-field-fill);
            ${selectVars['root.border-color']}: var(--engineering-field-border);
            ${selectVars['root.box-shadow']}: none;
        }
        & [data-workspace-part="table"] {
            background: var(--engineering-canvas);
            border-block-start: 1px solid var(--engineering-edge);
            ${tableVars['cell.background-color']}: var(--engineering-canvas);
            ${tableVars['header.background-color']}: var(--engineering-canvas);
            ${tableVars['root.border-color']}: color-mix(in oklch, ${token.color.text.primary} 6%, var(--engineering-canvas));
            ${tableVars['cell.border-color']}: color-mix(in oklch, ${token.color.text.primary} 6%, var(--engineering-canvas));
            ${tableVars['header.font-weight']}: ${token.font.weight.strong};
            ${tableVars['row-selection.background-color-selected']}: color-mix(in oklch, ${token.color.text.primary} 10%, var(--engineering-canvas));
            ${tableVars['row-selection.color-selected']}: ${token.color.text.primary};
            &:focus-within {
                ${tableVars['row-selection.background-color-selected']}: ${token.color.brand.primary};
                ${tableVars['row-selection.color-selected']}: ${token.color.text['on-brand']};
            }
        }
        & [data-workspace-part="inspector"] {
            position: relative;
            padding: 12px 20px 16px; gap: 12px;
            background: linear-gradient(110deg, color-mix(in oklch, var(--engineering-reflection) 9%, transparent), transparent 40%), var(--engineering-inspector-fill);
            backdrop-filter: var(--engineering-inspector-filter);
            -webkit-backdrop-filter: var(--engineering-inspector-filter);
            border-inline-start: 1px solid var(--engineering-edge);
            box-shadow: inset 1px 0 0 color-mix(in oklch, var(--engineering-reflection) 45%, transparent);
            ${lineEditVars['root.background-color']}: var(--engineering-field-fill);
            ${lineEditVars['root.border-color']}: var(--engineering-field-border);
            ${lineEditVars['root.box-shadow']}: none;
            ${textEditVars['root.background-color']}: var(--engineering-field-fill);
            ${textEditVars['root.border-color']}: var(--engineering-field-border);
            ${textEditVars['root.box-shadow']}: none;
            ${buttonVars['macos.control.background-image']}: none;
            ${buttonVars['macos.control.box-shadow']}: none;
            ${buttonVars['macos.prominent.border-color']}: transparent;
        }
        & [data-workspace-part="inspector"]::after {
            content: ''; position: absolute; inset: 0 auto 0 0; width: 1px;
            pointer-events: none; opacity: var(--engineering-rim-opacity);
            background: linear-gradient(180deg, var(--engineering-reflection), transparent 40%,
                color-mix(in oklch, var(--engineering-reflection) 40%, transparent));
        }
        & [data-workspace-part="identity"] { padding-block: 10px 4px; gap: 6px; }
        & [data-workspace-part="facts"] { gap: 10px; padding-block: 6px 12px; }
        & [data-workspace-part="fields"] {
            gap: 12px; padding-block: 16px;
            border-color: var(--engineering-edge);
        }
        & [data-workspace-part="footer"] {
            border-color: var(--engineering-edge); padding: 7px 16px;
        }
        @media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
          &[data-workspace-mode] {
            --engineering-glass-filter: none;
            --engineering-inspector-filter: none;
            --engineering-command-filter: none;
            --engineering-ambient-opacity: 0;
            --engineering-rim-opacity: 0;
            --engineering-glass-fill: ${token.color.surface.overlay};
            --engineering-inspector-fill: ${token.color.workspace.sidebar};
            --engineering-command-fill: ${token.color.surface.raised};
            --engineering-field-fill: ${token.color.surface.content};
            --engineering-field-border: ${token.color.border.default};
            background-image: none;
          }
        }
        @media (forced-colors: active) {
          &[data-workspace-mode] {
            ${splitPaneVars['separator.line.background-color']}: CanvasText;
            --engineering-canvas: Canvas;
            --engineering-glass-filter: none;
            --engineering-inspector-filter: none;
            --engineering-command-filter: none;
            --engineering-ambient-opacity: 0;
            --engineering-rim-opacity: 0;
            --engineering-glass-fill: Canvas;
            --engineering-inspector-fill: Canvas;
            --engineering-command-fill: ButtonFace;
            --engineering-field-fill: Field;
            --engineering-field-border: FieldText;
            --engineering-edge: CanvasText;
            --engineering-reflection: transparent;
            --engineering-shadow: transparent;
            background-image: none;
          }
        }
    }
`;
