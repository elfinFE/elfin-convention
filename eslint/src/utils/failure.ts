import {Rule} from 'eslint';

export function attachFailures(
    context:Rule.RuleContext,
    descriptors: Rule.ReportDescriptor[]
){
    for(const descriptor of descriptors){
        context.report(descriptor)
    }
}
