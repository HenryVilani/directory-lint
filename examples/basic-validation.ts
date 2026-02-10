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
        children: {
            "content.txt": {
                type: "file",
            },
            "note.txt": {
                type: "file",
            }
        }
    }

}

const lint = new DirectoryLint();
lint.generate("./", generateSchema);

lint.validate("./", schema);
