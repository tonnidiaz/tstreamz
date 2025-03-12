export const parseFilename = (filename: string) => {
    return filename?.endsWith("#") ? filename.split("#")[0] : filename;
};