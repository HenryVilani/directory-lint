import { DirectoryLint, type GenerateSchema, type ValidateSchema } from "directory-lint";

const generateSchema: GenerateSchema = {
    "generated": {
        type: "directory",
        children: {
            "content.txt": {
                type: "file",
                content: "1"
            },
            "note.txt": {
                type: "file",
            }
        }
    }
}

const schema: ValidateSchema = {

    "generated": {
        type: "directory",
        required: true,
        children: {
            "content.txt": {
                type: "file",
                required: true
            },
            "*.txt": {
                type: "file",
                validate: (content: string): boolean => {
                    return content.length > 1;
                }
            }
        }
    }

}

const lint = new DirectoryLint();
lint.generate("./", generateSchema);

lint.validate("./", schema);
