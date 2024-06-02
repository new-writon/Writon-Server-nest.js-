import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation
} from "typeorm";
import { Comment } from "./Comment.js";
import { Likes } from "./Likes.js";
import { QuestionContent } from "./QuestionContent.js";
import { UserChallenge } from "../../../user/domain/entity/UserChallenge.js";
import { BaseEntity } from "../../../../global/entity/Base.Entitiy.js";
import { InternalServerErrorException } from "@nestjs/common";


@Index("UserTemplete_user_challenge_id_fkey", ["user_challenge_id"], {})
@Entity("UserTemplete")
export class UserTemplete extends BaseEntity{

  constructor(   
    userChallengeId:number,
    finished_at:Date,
    complete:boolean
  ){
    super();
    this.setUserChallengeId(userChallengeId);
    this.setFinishedAt(finished_at);
    this.setComplete(complete);
  }

  @PrimaryGeneratedColumn({ type: "int", name: "user_templete_id" })
  user_templete_id: number;

  @Column("int", { name: "user_challenge_id" })
  user_challenge_id: number;

  @Column("date", { name: "finished_at", nullable: true })
  finished_at: Date | null;

  @Column("tinyint", { name: "complete", nullable: true, width: 1 })
  complete: boolean | null;

  @OneToMany(() => Comment, (comment) => comment.userTemplete)
  comments: Relation<Comment>[];

  @OneToMany(() => Likes, (likes) => likes.userTemplete)
  likes: Relation<Likes>[];

  @OneToMany(
    () => QuestionContent,
    (questionContent) => questionContent.userTemplete
  )
  questionContents: Relation<QuestionContent>[];

  @ManyToOne(
    () => UserChallenge,
    (userChallenge) => userChallenge.userTempletes,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([
    { name: "user_challenge_id", referencedColumnName: "user_challenge_id" },
  ])
  userChallenge: Relation<UserChallenge>;

  public static createUserTemplate(
    userChallengeId:number,
    finished_at:Date,
    complete:boolean
  ){
    return new UserTemplete(userChallengeId,finished_at,complete);
  }

  private setUserChallengeId(userChallengeId:number){
    if(userChallengeId === null) throw new InternalServerErrorException (`${__dirname} : userChallengeId 값이 존재하지 않습니다.`);
    this.user_challenge_id=userChallengeId
  }


  private setFinishedAt(finishedAt:Date){
    if(finishedAt === null) throw new InternalServerErrorException (`${__dirname} : finishedAt 값이 존재하지 않습니다.`);
    this.finished_at=finishedAt
  }

  private setComplete(complete:boolean){
    if(complete === null) throw new InternalServerErrorException (`${__dirname} : complete값이 존재하지 않습니다.`);
    this.complete=complete
  }

  public getId(){
    return this.user_templete_id
  }

  public getFinishedAt(): Date{
    return this.finished_at;
  }

  public getComplete(): boolean{
    return this.complete;
  }

  public getUserChallengeId(){
    return this.user_challenge_id
  }



  
}
