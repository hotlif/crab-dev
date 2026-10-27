import { globalStyle } from '@crab-dev/css';
import palette from '@crab-dev/rc-token-global';
import token from '@crab-dev/rc-token-semantic';

// Data grids and editing workspaces extend M3 lists/dividers. Keep their roles
// on every design boundary so nested previews restore geometry and selection.
globalStyle`
    :root,
    [data-crab-design='md3'] {
        --token-semantic-data-table-header-background: ${token.color.surface.container};
        --token-semantic-data-table-header-color: ${token.color.text.secondary};
        --token-semantic-data-table-border-color: ${token.color.border.default};
        --token-semantic-data-table-cell-separator: transparent;
        --token-semantic-data-table-cell-padding-inline: ${palette.space[4]};
        --token-semantic-data-table-row-selected-background: ${token.color.selection.background};
        --token-semantic-data-table-row-selected-color: ${token.color.selection.foreground};
        --token-semantic-data-table-row-hover-background: ${token.color.background['hover-subtle']};
        --token-semantic-data-table-radius: ${palette.radius[6]};
        --token-semantic-data-chart-series-1: ${token.color.brand.primary};
        --token-semantic-data-chart-series-2: ${token.color.tertiary.primary};
        --token-semantic-data-chart-series-3: ${palette.blue[600]};
        --token-semantic-data-chart-series-4: ${palette.amber[600]};
        --token-semantic-data-chart-series-5: ${token.color.secondary.primary};
        --token-semantic-data-chart-series-6: ${palette.green[600]};
        --token-semantic-data-chart-series-7: ${palette.purple[30]};
        --token-semantic-data-chart-series-8: ${palette.red[600]};
        --token-semantic-data-split-handle-width: ${palette.space[2]};
        --token-semantic-data-split-grip-width: ${palette.space[0]};
        --token-semantic-data-split-grip-height: ${palette.space[0]};
        --token-semantic-data-split-grip-radius: ${palette.radius.full};
    }

    [data-crab-design='shadcn'] {
        --token-semantic-data-table-header-background: ${token.color.surface.content};
        --token-semantic-data-table-header-color: ${token.color.text.primary};
        --token-semantic-data-table-border-color: ${token.color.border.default};
        --token-semantic-data-table-cell-separator: transparent;
        --token-semantic-data-table-cell-padding-inline: ${palette.space[2]};
        --token-semantic-data-table-row-selected-background: ${token.color.fill.subtle};
        --token-semantic-data-table-row-selected-color: ${token.color.text.primary};
        --token-semantic-data-table-row-hover-background: color-mix(in oklch, ${token.color.fill.subtle} 50%, ${token.color.surface.content});
        --token-semantic-data-table-radius: ${palette.radius[4]};
        --token-semantic-data-chart-series-1: ${palette.amber[600]};
        --token-semantic-data-chart-series-2: ${palette.green[700]};
        --token-semantic-data-chart-series-3: ${palette.blue[800]};
        --token-semantic-data-chart-series-4: ${palette.amber[400]};
        --token-semantic-data-chart-series-5: ${palette.red[500]};
        --token-semantic-data-chart-series-6: ${palette.purple[40]};
        --token-semantic-data-chart-series-7: ${palette.green[500]};
        --token-semantic-data-chart-series-8: ${palette.blue[500]};
        --token-semantic-data-split-handle-width: ${palette.space[2]};
        --token-semantic-data-split-grip-width: ${palette.space[1]};
        --token-semantic-data-split-grip-height: ${palette.space[4]};
        --token-semantic-data-split-grip-radius: ${palette.radius[1]};
    }

    [data-crab-design='apple'] {
        --token-semantic-data-table-header-background: ${token.color.workspace.toolbar};
        --token-semantic-data-table-header-color: ${token.color.text.secondary};
        --token-semantic-data-table-border-color: ${token.color.border.subtle};
        --token-semantic-data-table-cell-separator: ${token.color.border.subtle};
        --token-semantic-data-table-cell-padding-inline: ${palette.space[3]};
        --token-semantic-data-table-row-selected-background: ${token.color.selection.background};
        --token-semantic-data-table-row-selected-color: ${token.color.selection.foreground};
        --token-semantic-data-table-row-hover-background: ${token.color.background['hover-subtle']};
        --token-semantic-data-table-radius: ${palette.radius[4]};
        --token-semantic-data-chart-series-1: ${palette.blue[600]};
        --token-semantic-data-chart-series-2: ${palette.amber[600]};
        --token-semantic-data-chart-series-3: ${palette.green[600]};
        --token-semantic-data-chart-series-4: ${palette.purple[40]};
        --token-semantic-data-chart-series-5: ${palette.red[600]};
        --token-semantic-data-chart-series-6: ${palette.blue[800]};
        --token-semantic-data-chart-series-7: ${palette.green[800]};
        --token-semantic-data-chart-series-8: ${palette.amber[800]};
        --token-semantic-data-split-handle-width: ${palette.space[1]};
        --token-semantic-data-split-grip-width: ${palette.space[0]};
        --token-semantic-data-split-grip-height: ${palette.space[0]};
        --token-semantic-data-split-grip-radius: ${palette.radius.full};
    }

    [data-crab-design][data-theme='dark'] {
        --token-semantic-data-chart-series-3: ${palette.blue[400]};
        --token-semantic-data-chart-series-4: ${palette.amber[400]};
        --token-semantic-data-chart-series-6: ${palette.green[400]};
        --token-semantic-data-chart-series-7: ${palette.amber[600]};
        --token-semantic-data-chart-series-8: ${palette.red[400]};
    }
    [data-crab-design='shadcn'][data-theme='dark'] {
        --token-semantic-data-chart-series-1: ${palette.blue[500]};
        --token-semantic-data-chart-series-2: ${palette.green[400]};
        --token-semantic-data-chart-series-3: ${palette.amber[400]};
        --token-semantic-data-chart-series-4: ${palette.purple[80]};
        --token-semantic-data-chart-series-5: ${palette.red[400]};
        --token-semantic-data-chart-series-6: ${palette.blue[300]};
        --token-semantic-data-chart-series-7: ${palette.green[300]};
        --token-semantic-data-chart-series-8: ${palette.amber[600]};
    }
    [data-crab-design='apple'][data-theme='dark'] {
        --token-semantic-data-chart-series-1: ${palette.blue[400]};
        --token-semantic-data-chart-series-2: ${palette.amber[400]};
        --token-semantic-data-chart-series-3: ${palette.green[400]};
        --token-semantic-data-chart-series-4: ${palette.purple[80]};
        --token-semantic-data-chart-series-5: ${palette.red[400]};
        --token-semantic-data-chart-series-6: ${palette.blue[300]};
        --token-semantic-data-chart-series-7: ${palette.green[300]};
        --token-semantic-data-chart-series-8: ${palette.amber[300]};
    }

    @media (forced-colors: active) {
        :root, [data-crab-design], [data-crab-design][data-theme] {
            --token-semantic-data-table-header-background: Canvas;
            --token-semantic-data-table-header-color: CanvasText;
            --token-semantic-data-table-border-color: CanvasText;
            --token-semantic-data-table-cell-separator: CanvasText;
            --token-semantic-data-table-row-selected-background: Highlight;
            --token-semantic-data-table-row-selected-color: HighlightText;
            --token-semantic-data-table-row-hover-background: Canvas;
            --token-semantic-data-chart-series-1: CanvasText;
            --token-semantic-data-chart-series-2: Highlight;
            --token-semantic-data-chart-series-3: LinkText;
            --token-semantic-data-chart-series-4: CanvasText;
            --token-semantic-data-chart-series-5: Highlight;
            --token-semantic-data-chart-series-6: LinkText;
            --token-semantic-data-chart-series-7: CanvasText;
            --token-semantic-data-chart-series-8: Highlight;
        }
    }
`;
