import { Root, Layout } from "./ui/root.js";
export { Root, Layout };
import { Header, Navigation, MobileNavigation } from "./ui/navigation.js";
export { Header, Navigation, MobileNavigation };
import { SearchDialog } from "./ui/search-dialog.js";
export { SearchDialog };
import { TableOfContents, Page, CodeBlock, ApiTable, Demo, PageLoading, PageError, NotFound } from "./ui/content.js";
export { TableOfContents, Page, CodeBlock, ApiTable, Demo, PageLoading, PageError, NotFound };

import { defineDocsUI } from "@crab-dev/wake/docs";

import "./siteStyles.js";

import "./documentStyles.js";

import "./catalogStyles.js";
import "./designStyles.js";

export default defineDocsUI({
    Root,
    Layout,
    Header,
    Navigation,
    MobileNavigation,
    SearchDialog,
    TableOfContents,
    Page,
    CodeBlock,
    ApiTable,
    Demo,
    PageLoading,
    PageError,
    NotFound,
});
