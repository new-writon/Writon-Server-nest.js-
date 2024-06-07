

export enum AgoraErrorCode  {
    
    NOT_FOUND_PARTICULAR_AGORA = 600,
    NO_VALUE=502,
    UNAUTHORIZED = 1001,
    
}

// 각 에러 코드에 대한 메시지 정의
const ErrorMessages: { [key: number]: string } = {
    600: "특정 아고라 데이터가 존재하지 않습니다.",
    502: "해당 값이 존재하지 않습니다."

};

export function errorMessage(code: AgoraErrorCode): string {
    return ErrorMessages[code] || "알 수 없는 오류가 발생하였습니다.";
}