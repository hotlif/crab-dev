import packageJson from '../../package.json';

export const printSystemInfo = () => {
    console.debug("======================== System Info ========================");
    console.debug("Name:", packageJson.name);
    console.debug("Version:", packageJson.version);
    console.debug("Author:", packageJson.author);
    console.debug("Description:", packageJson.description);
    console.debug("Dependencies:");
    Object.keys(packageJson.dependencies).forEach((key) => {
        const dependencies: Record<string, string> = packageJson.dependencies;
        console.debug(`     - ${key}: ${dependencies[key]}`);
    })
    console.debug("==============================================================");
}

