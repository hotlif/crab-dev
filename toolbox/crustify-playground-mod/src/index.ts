import { type Modification, type Configuration } from "@crab-dev/crustify"

class CrustifyPlaygroundMod implements Modification {
    modifyEntry() {
        return "";
    }
 
    modifyWebpack(conf: Configuration) {
        return conf;
    }
}

export default CrustifyPlaygroundMod;