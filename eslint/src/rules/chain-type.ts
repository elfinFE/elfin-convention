import {Rule} from 'eslint'
import {Node} from 'estree'
import {isSystemComment, SYSTEM_COMMENT_POSITION_ERROR_MESSAGE} from '../utils'

interface Routes {
    path: string
    name: string
    component: unknown
    subLevels: Routes
}

interface RoutesInfo {
    [index: string]: Routes
}

const ROUTER_FILE_NAME = 'router-file'
/** routes info from router file*/
const routesInfo: RoutesInfo = {}

function isSystemRouterComment(comment: string): boolean {
    return new RegExp(`^\\$${ROUTER_FILE_NAME}`).test(comment)
}

/** For webstorm code hint */
class Chain implements Rule.RuleModule {
    meta?: Rule.RuleMetaData = {
        fixable: 'code',
        messages: {},
        schema: [{type: 'object', required: true}],
    }

    // bind this
    private walkProgram = (node: Node) => {}

    create(context: Rule.RuleContext): Rule.RuleListener {
        const comments = context.getSourceCode().getAllComments()
        const firstComment = comments[0]
        const {value} = firstComment
        const {
            start: {line},
        } = firstComment.loc!

        // system comment must be on the first line of editor
        if (line !== 1 && isSystemComment(value)) {
            throw new Error(SYSTEM_COMMENT_POSITION_ERROR_MESSAGE)
        }

        // collect routes info
        if (isSystemRouterComment(value)) {
            console.info('in')
        }

        return {Program: this.walkProgram}
    }
}

module.exports = new Chain()
