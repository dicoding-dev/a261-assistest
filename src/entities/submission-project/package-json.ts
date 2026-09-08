interface PackageJson {
    scripts?: object
    dependencies?: Dependencies
    devDependencies?: Dependencies
    eslintConfig?: object
}

interface Dependencies{
    eslint?: string
    [packageName: string]: string | undefined
}

export default PackageJson
