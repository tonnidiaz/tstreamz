export const isTuError = (er: any): string | undefined =>{
    const msg = er?.response?.data?.message
    return msg?.startsWith?.('tu:') ? msg.replace('tu:', '') : undefined
}