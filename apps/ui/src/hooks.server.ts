import { handleErrs, isTuError } from "@cmn/utils/funcs";
import { HandleServerError } from "@sveltejs/kit";

export const handleError: HandleServerError = async ({
    error,
    status,
}) => {
    handleErrs(error);
    return { message: "tu:" + (isTuError(error) || "Something went wrong"), status };
};

