import {Rule} from 'eslint'

export const SYSTEM_COMMENT_POSITION_ERROR_MESSAGE =
    'System comment must be on the first line of editor'

export function attachFailures(
    context: Rule.RuleContext,
    descriptors: Rule.ReportDescriptor[],
) {
    for (const descriptor of descriptors) {
        context.report(descriptor)
    }
}
