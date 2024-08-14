import { DataSource, Repository } from "typeorm";
import { SmallTalkRepository} from "../SmallTalk.Repository.js";
import { SmallTalk } from "../../entity/SmallTalk.js";
import { Injectable } from "@nestjs/common";
import { SmallTalkComment } from "../../entity/SmallTalkComment.js";
import { ParticularSmallTalkData } from "../../../dto/ParticularSmallTalkData.js";


@Injectable()
export class SmallTalkDao extends Repository<SmallTalk> implements SmallTalkRepository{

    constructor(private dataSource: DataSource) { super(SmallTalk, dataSource.createEntityManager()); }

    async findParticularSmallTalkByChallengeIdAndDate(challengeId:number, date:Date):Promise<ParticularSmallTalkData[]>{
        const particularSmallTalkData :ParticularSmallTalkData[] = await this.dataSource.createQueryBuilder()
            .select([
                'ag.agora_id AS agoraId',
                'ag.question AS question',
                'COUNT(DISTINCT agc.affiliation_id) AS participateCount',
                "DATE_FORMAT(ag.createdAt, '%H:%i') AS createdTime",
                "DATE(ag.createdAt) AS createdDate",
                'ag.user_challenge_id AS user_challenge_id'
            ])
            .from(SmallTalk, 'ag')
            .leftJoin(SmallTalkComment, 'agc', 'agc.agora_id = ag.agora_id')
            .where('DATE(ag.createdAt) = :date', { date })
            .andWhere('ag.challenge_id = :challengeId', { challengeId })
            .groupBy('ag.agora_id, ag.question, ag.createdAt, ag.user_challenge_id')
            .orderBy('ag.createdAt', 'DESC')
            .getRawMany();
    
        return particularSmallTalkData.map((data)=> new ParticularSmallTalkData(data.smallTalkId, data.question, data.participateCount, data.createdTime, data.createdDate, data.userChallengeId))
        
        }

    async insertSmallTalk(challengeId: number, userChallengeId: number, question:string):Promise<void>{
        const newAgora = SmallTalk.createSmallTalk(challengeId, userChallengeId, question);
        await this.save(newAgora);
    }
    

    async findSmallTalkByChallengeIdAndDate(challengeId:number, date:string):Promise<SmallTalk[]>{
        return this.dataSource.createQueryBuilder()
        .select('ag')
        .from(SmallTalk, 'ag')
        .where('DATE(ag.createdAt) = :date', { date })
        .andWhere('ag.challenge_id = :challengeId', { challengeId })
        .getMany()
    }
}
