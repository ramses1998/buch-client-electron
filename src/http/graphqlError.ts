export interface GraphqlErrorResponse {
    errors: GraphQLErrorItem[];
    data: unknown;
}

export interface GraphQLErrorItem {
    message: string;
    locations: StacktraceLocation[];
    path: string[];
    extensions: StacktraceExtension;
}

interface StacktraceLocation {
    line: number;
    column: number;
}

interface StacktraceExtension {
    code: string;
    stacktrace: string[];
}
