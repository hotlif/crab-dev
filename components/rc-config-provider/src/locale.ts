import { useConfig } from './context.js';
import type { ConfigLocale } from './types.js';

export interface LocaleMessages {
    common: { close: string; cancel: string; confirm: string; clear: string; reset: string; loading: string; empty: string };
    badge: { dotLabel: string };
    fields: { showPassword: string; hidePassword: string; scientificValue: (mantissa: string, exponent: number | string) => string; characterCount: (current: number, max?: number) => string };
    avatar: { more: (count: number) => string };
    tabs: { closeTab: string };
    breadcrumbs: { label: string };
    splitPane: { resize: string };
    canvas: { editText: string };
    pagination: { previous: string; next: string; page: string; pageSize: string; total: string; label: string; jump: string; jumpBackward: string; jumpForward: string; pageSizeLabel: (size: number) => string; totalLabel: (from: number, to: number, total: number) => string };
    select: { search: string; empty: string; selectAll: string; placeholder: string; openOptions: string; closeOptions: string; removeTag: (label: string) => string };
    table: { empty: string; sortAscending: string; sortDescending: string; clearSort: string; selectAll: string; selectRow: string; filter: string; deselectAll: string; expandRow: string; collapseRow: string; expandChildren: string; collapseChildren: string; emptyValue: string; currentColumn: string; resizeColumn: (label: string) => string };
    datePicker: { previousMonth: string; nextMonth: string; previousYear: string; nextYear: string; today: string; now: string; clear: string; chooseDate: string; chooseDateTime: string; chooseTime: string; startDate: string; endDate: string; cancel: string; confirm: string; enterTime: string; hour: string; minute: string; second: string; selectHour: string; selectMinute: string; period: string; am: string; pm: string; switchToDial: string; switchToInput: string; hourDial: string; minuteDial: string; openCalendar: string; clearDate: string; clearTime: string };
    colorPicker: { chooseColor: string; colorDialog: string; format: string; value: string; lightness: string; chroma: string; hue: string; alpha: string; confirm: string; cancel: string; reset: string };
    tablePro: { columnLoadError: string; dataLoadError: string; retry: string; selectAllColumns: string; searchColumns: string; expandAll: string; collapseAll: string; resetWidths: string; resetWidthsDescription: string; searchFilters: string; clearAll: string; noFilterableColumns: string; noMatchingColumns: string; searchTable: string; noMatches: string; previousMatch: string; nextMatch: string; columns: string; filters: string; exportCsv: string; refresh: string; enableSorting: string; disableSorting: string; pinLeft: string; unpinLeft: string; pinRight: string; unpinRight: string; columnActions: (label: string) => string };
    appLayout: { logo: string; toggleSidebar: string; enterFullscreen: string; exitFullscreen: string; notifications: string; loadingUser: string; userMenu: string; userAvatar: string; userActions: string; switchRole: string; logout: string; reloadPage: string; close: string; closeOthers: string; closeRight: string; closeAll: string; openedPages: string; closeTab: string };
    upload: { selectFiles: string; uploading: string; remove: string; retry: string };
    tree: { expand: string; collapse: string; selectNode: string; dragAbove: string; dragBelow: string; dragInside: string };
    empty: { default: { title: string; description: string }; search: { title: string; description: string }; noPermission: { title: string; description: string } };
    notification: { close: string };
    form: { required: (label?: string) => string; invalid: string };
}

export const localeMessages: Readonly<Record<ConfigLocale, LocaleMessages>> = {
    'zh-CN': {
        common: { close: '关闭', cancel: '取消', confirm: '确定', clear: '清除', reset: '重置', loading: '加载中', empty: '暂无数据' },
        badge: { dotLabel: '状态标记' },
        fields: { showPassword: '显示密码', hidePassword: '隐藏密码', scientificValue: (mantissa, exponent) => `${mantissa} 乘以 10 的 ${exponent} 次方`, characterCount: (current, max) => `${current}${max === undefined ? '' : ` / ${max}`} 字符` },
        avatar: { more: count => `另外 ${new Intl.NumberFormat('zh-CN').format(count)} 个头像` },
        tabs: { closeTab: '关闭标签页' },
        breadcrumbs: { label: '面包屑导航' },
        splitPane: { resize: '调整面板大小' },
        canvas: { editText: '编辑画布文本' },
        pagination: { previous: '上一页', next: '下一页', page: '页码', pageSize: '每页条数', total: '总条数', label: '分页', jump: '跳转页码', jumpBackward: '向前跳转', jumpForward: '向后跳转', pageSizeLabel: size => `${new Intl.NumberFormat('zh-CN').format(size)} 条/页`, totalLabel: (from, to, total) => `第 ${new Intl.NumberFormat('zh-CN').format(from)}–${new Intl.NumberFormat('zh-CN').format(to)} 条，共 ${new Intl.NumberFormat('zh-CN').format(total)} 条` },
        select: { search: '搜索', empty: '暂无选项', selectAll: '全选', placeholder: '请选择', openOptions: '展开选项', closeOptions: '收起选项', removeTag: label => `移除 ${label}` },
        table: { empty: '暂无数据', sortAscending: '升序', sortDescending: '降序', clearSort: '取消排序', selectAll: '全选', selectRow: '选择行', filter: '筛选', deselectAll: '取消全选', expandRow: '展开行', collapseRow: '折叠行', expandChildren: '展开子级', collapseChildren: '折叠子级', emptyValue: '空值', currentColumn: '当前列', resizeColumn: label => `调整 ${label} 列宽` },
        datePicker: { previousMonth: '上个月', nextMonth: '下个月', previousYear: '上一年', nextYear: '下一年', today: '今天', now: '现在', clear: '清除', chooseDate: '选择日期', chooseDateTime: '选择日期和时间', chooseTime: '选择时间', startDate: '开始日期', endDate: '结束日期', cancel: '取消', confirm: '确定', enterTime: '输入时间', hour: '小时', minute: '分钟', second: '秒', selectHour: '选择小时，当前', selectMinute: '选择分钟，当前', period: '时段', am: '上午', pm: '下午', switchToDial: '切换到表盘选择', switchToInput: '切换到键盘输入', hourDial: '小时表盘', minuteDial: '分钟表盘', openCalendar: '打开日历', clearDate: '清除日期', clearTime: '清除时间' },
        colorPicker: { chooseColor: '选择颜色', colorDialog: '颜色选择', format: '颜色格式', value: '颜色值', lightness: '亮度', chroma: '色度', hue: '色相', alpha: '透明度', confirm: '确定', cancel: '取消', reset: '重置' },
        tablePro: { columnLoadError: '列配置加载失败', dataLoadError: '数据加载失败', retry: '重试', selectAllColumns: '选择全部列', searchColumns: '搜索列', expandAll: '全部展开', collapseAll: '全部折叠', resetWidths: '重置列宽', resetWidthsDescription: '恢复所有列的默认宽度', searchFilters: '搜索筛选项', clearAll: '全部清除', noFilterableColumns: '暂无可筛选列', noMatchingColumns: '未找到匹配列', searchTable: '搜索表格', noMatches: '无匹配结果', previousMatch: '上一个匹配', nextMatch: '下一个匹配', columns: '列设置', filters: '筛选', exportCsv: '导出 CSV', refresh: '刷新', enableSorting: '启用排序', disableSorting: '禁用排序', pinLeft: '固定到左侧', unpinLeft: '取消左侧固定', pinRight: '固定到右侧', unpinRight: '取消右侧固定', columnActions: label => `${label} 列操作` },
        appLayout: { logo: '应用标志', toggleSidebar: '切换侧边栏', enterFullscreen: '进入全屏', exitFullscreen: '退出全屏', notifications: '通知', loadingUser: '加载用户', userMenu: '用户菜单', userAvatar: '用户头像', userActions: '用户操作', switchRole: '切换角色', logout: '退出登录', reloadPage: '重新加载页面', close: '关闭', closeOthers: '关闭其他页面', closeRight: '关闭右侧页面', closeAll: '关闭全部页面', openedPages: '已打开页面', closeTab: '关闭标签页' },
        upload: { selectFiles: '选择文件', uploading: '上传中', remove: '移除', retry: '重试' },
        tree: { expand: '展开', collapse: '折叠', selectNode: '选择节点', dragAbove: '拖动到上方', dragBelow: '拖动到下方', dragInside: '拖动到内部' },
        empty: { default: { title: '暂无数据', description: '当前还没有内容，快去添加吧' }, search: { title: '未找到匹配内容', description: '尝试修改关键词或调整筛选条件' }, noPermission: { title: '暂无访问权限', description: '请联系管理员获取相应权限' } },
        notification: { close: '关闭通知' },
        form: { required: label => label ? `请输入${label}` : '此项为必填项', invalid: '输入无效' },
    },
    'en-US': {
        common: { close: 'Close', cancel: 'Cancel', confirm: 'Confirm', clear: 'Clear', reset: 'Reset', loading: 'Loading', empty: 'No data' },
        badge: { dotLabel: 'Status indicator' },
        fields: { showPassword: 'Show password', hidePassword: 'Hide password', scientificValue: (mantissa, exponent) => `${mantissa} times 10 to the power of ${exponent}`, characterCount: (current, max) => `${current}${max === undefined ? '' : ` / ${max}`} characters` },
        avatar: { more: count => `${new Intl.NumberFormat('en-US').format(count)} more ${count === 1 ? 'avatar' : 'avatars'}` },
        tabs: { closeTab: 'Close tab' },
        breadcrumbs: { label: 'Breadcrumb' },
        splitPane: { resize: 'Resize panels' },
        canvas: { editText: 'Edit canvas text' },
        pagination: { previous: 'Previous page', next: 'Next page', page: 'Page', pageSize: 'Rows per page', total: 'Total', label: 'Pagination', jump: 'Jump to page', jumpBackward: 'Jump backward', jumpForward: 'Jump forward', pageSizeLabel: size => `${new Intl.NumberFormat('en-US').format(size)} rows per page`, totalLabel: (from, to, total) => `${new Intl.NumberFormat('en-US').format(from)}–${new Intl.NumberFormat('en-US').format(to)} of ${new Intl.NumberFormat('en-US').format(total)}` },
        select: { search: 'Search', empty: 'No options', selectAll: 'Select all', placeholder: 'Select an option', openOptions: 'Open options', closeOptions: 'Close options', removeTag: label => `Remove ${label}` },
        table: { empty: 'No data', sortAscending: 'Sort ascending', sortDescending: 'Sort descending', clearSort: 'Clear sorting', selectAll: 'Select all', selectRow: 'Select row', filter: 'Filter', deselectAll: 'Deselect all', expandRow: 'Expand row', collapseRow: 'Collapse row', expandChildren: 'Expand children', collapseChildren: 'Collapse children', emptyValue: 'Empty value', currentColumn: 'Current column', resizeColumn: label => `Resize ${label} column` },
        datePicker: { previousMonth: 'Previous month', nextMonth: 'Next month', previousYear: 'Previous year', nextYear: 'Next year', today: 'Today', now: 'Now', clear: 'Clear', chooseDate: 'Choose date', chooseDateTime: 'Choose date and time', chooseTime: 'Choose time', startDate: 'Start date', endDate: 'End date', cancel: 'Cancel', confirm: 'Confirm', enterTime: 'Enter time', hour: 'hour', minute: 'minute', second: 'second', selectHour: 'Select hour', selectMinute: 'Select minute', period: 'Period', am: 'AM', pm: 'PM', switchToDial: 'Switch to dial', switchToInput: 'Switch to input', hourDial: 'Hour dial', minuteDial: 'Minute dial', openCalendar: 'Open calendar', clearDate: 'Clear date', clearTime: 'Clear time' },
        colorPicker: { chooseColor: 'Choose color', colorDialog: 'Choose color', format: 'Color format', value: 'Color value', lightness: 'Lightness', chroma: 'Chroma', hue: 'Hue', alpha: 'Alpha', confirm: 'Confirm', cancel: 'Cancel', reset: 'Reset' },
        tablePro: { columnLoadError: 'Unable to load columns', dataLoadError: 'Unable to load data', retry: 'Retry', selectAllColumns: 'Select all columns', searchColumns: 'Search columns', expandAll: 'Expand all', collapseAll: 'Collapse all', resetWidths: 'Reset column widths', resetWidthsDescription: 'Restore default widths for all columns', searchFilters: 'Search filters', clearAll: 'Clear all', noFilterableColumns: 'No filterable columns', noMatchingColumns: 'No matching columns', searchTable: 'Search table', noMatches: 'No matches', previousMatch: 'Previous match', nextMatch: 'Next match', columns: 'Columns', filters: 'Filters', exportCsv: 'Export CSV', refresh: 'Refresh', enableSorting: 'Enable sorting', disableSorting: 'Disable sorting', pinLeft: 'Pin left', unpinLeft: 'Unpin left', pinRight: 'Pin right', unpinRight: 'Unpin right', columnActions: label => `${label} column actions` },
        appLayout: { logo: 'Application logo', toggleSidebar: 'Toggle sidebar', enterFullscreen: 'Enter fullscreen', exitFullscreen: 'Exit fullscreen', notifications: 'Notifications', loadingUser: 'Loading user', userMenu: 'User menu', userAvatar: 'User avatar', userActions: 'User actions', switchRole: 'Switch role', logout: 'Sign out', reloadPage: 'Reload page', close: 'Close', closeOthers: 'Close other pages', closeRight: 'Close pages to the right', closeAll: 'Close all pages', openedPages: 'Open pages', closeTab: 'Close tab' },
        upload: { selectFiles: 'Choose files', uploading: 'Uploading', remove: 'Remove', retry: 'Retry' },
        tree: { expand: 'Expand', collapse: 'Collapse', selectNode: 'Select node', dragAbove: 'Move above', dragBelow: 'Move below', dragInside: 'Move inside' },
        empty: { default: { title: 'No data', description: 'There is no content yet. Add some to get started.' }, search: { title: 'No results found', description: 'Try different keywords or filters.' }, noPermission: { title: 'Access denied', description: 'Contact your administrator to request access.' } },
        notification: { close: 'Close notification' },
        form: { required: label => label ? `Please enter ${label}` : 'This field is required', invalid: 'Invalid value' },
    },
};

/** Library-owned copy follows the nearest independently inherited locale. */
export function useLocale(): { locale: ConfigLocale; messages: LocaleMessages } {
    const { locale } = useConfig();
    return { locale, messages: localeMessages[locale] };
}
