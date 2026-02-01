import { DirectoryLint, type LintSchema } from "directory-lint";

const schema: LintSchema = {

    "basic_file": {
        type: "file",
        required: true
    },

    "basic_folder": {
        type: "dir",
        required: true,
        children: {
            "sub_dir_file": {
                type: "file",
                required: true
            }
        }
    }

}


const linter = new DirectoryLint();
linter.generate("./generated", schema);

