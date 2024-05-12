import { ChallengeDay } from "../../challenge/domain/entity/ChallengeDay.js";
import { UserTemplete } from "../../template/domain/entity/UserTemplete.js";


const sortCallendarDateBadge = (
    challengeDays: ChallengeDay[],
    userTemplateDays: UserTemplete[]
) => {
    const result = [];
    for (const challengeDay of challengeDays!) {
        const hasMatchingDate = userTemplateDays!.some(userTemplateDay =>
            isSameDate(new Date(challengeDay.getDay()), new Date(userTemplateDay.getFinishedAt()))
        );

        const customObject:  { date:Date, badge?: string } = {
            date: challengeDay.day
        };
 
        if (hasMatchingDate) {
            const matchingUserTemplateDays = userTemplateDays!.filter(userTemplateDays =>
                isSameDate(new Date(challengeDay.getDay()), new Date((userTemplateDays.getFinishedAt())))
            );
            for (const matchingUserTemplateDay of matchingUserTemplateDays) {
                if (matchingUserTemplateDay.getComplete()) {
                    customObject["badge"] = "Gold";
                } else {
                    customObject["badge"] = "Silver";
                }
                result.push({ ...customObject }); 
            }
        }
         else if (isSameDate(new Date(challengeDay.getDay()), new Date())) {
           // isSameDate(challengeDay.day, new Date())

            customObject["badge"] = "Purple";
            result.push({ ...customObject });
        } else {

            customObject["badge"] = "lightPurple";
            result.push({ ...customObject });
        }
    }
    return result
}

const isSameDate = (
    firstDate: Date,
    secondDate: Date
): boolean => {
    return (
       
        firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate()
        
    );
}


export {
    sortCallendarDateBadge,
    isSameDate
}