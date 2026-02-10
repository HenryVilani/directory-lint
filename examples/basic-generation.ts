import { DirectoryLint, type GenerateSchema } from "directory-lint";

const schema: GenerateSchema = {

    "basic_file": {
        type: "file",
    },

    "basic_folder": {
        type: "directory",
        children: {
            "sub_dir_file": {
                type: "file",
                content: "sdfsdfsdf"
                
            }
        }
    }

}

const linter = new DirectoryLint();
linter.generate("./generated", schema, {overwrite: true});

