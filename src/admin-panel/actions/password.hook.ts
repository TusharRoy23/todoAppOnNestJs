import * as bcrypt from "bcrypt"

export const passwordBeforeHook = async (request) => {
    // if (request.payload.password) {
    //     const hashedPwd = await bcrypt.hash(request.payload.password, 10);
    //     request.payload = {
    //         ...request.payload,
    //         encryptedPassword: hashedPwd,
    //         password: undefined
    //     }
    // }
    if (request.method === 'post') {
        const { password, ...otherParams } = request.payload;

        if (password) {
            const encryptedPassword = await bcrypt.hash(password, 10);

            return {
                ...request,
                payload: {
                    ...otherParams,
                    encryptedPassword
                }
            }
        }
    }
    return request;
}
