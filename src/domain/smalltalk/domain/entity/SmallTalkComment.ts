import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation
} from "typeorm";
import { Affiliation } from "../../../user/domain/entity/Affiliation.js";
import { SmallTalk } from "./SmallTalk.js";
import { BaseEntity } from "../../../../global/entity/base.entitiy.js";
import { InternalServerErrorException } from "@nestjs/common";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//@Index("AgoraComment_agora_id_fkey_idx", ["small_talk_id"], {})
//@Index("AgoraComment_affiliation_id_fkey_idx", ["affiliation_id"], {})
@Entity("small_talk_comment", { schema: "nest" })
export class SmallTalkComment extends BaseEntity{

  constructor(
      smallTalkId:number,
      affiliationId:number,
      smallTalkComment:string
  ){
    super()
    this.setSmallTalkId(smallTalkId);
    this.setAffiliationId(affiliationId);
    this.setContent(smallTalkComment);
  }

  public static createSmallTalkComment(
    smallTalkId:number,
    affiliationId:number,
    smallTalkComment:string
  ){
    return new SmallTalkComment(smallTalkId, affiliationId, smallTalkComment);
  }


  @PrimaryGeneratedColumn({ type: "int", name: "small_talk_comment_id" })
  smallTalkCommentId: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("int", { name: "small_talk_id" })
  smallTalkId: number;

  @Column("int", { name: "affiliation_id" })
  affiliationId: number;


  @ManyToOne(() => Affiliation, (affiliation) => affiliation.smallTalkComments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "affiliation_id", referencedColumnName: "affiliationId" },
  ])
  affiliation: Relation<Affiliation>;

  @ManyToOne(() => SmallTalk, (smallTalk) => smallTalk.smallTalkComments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "small_talk_id", referencedColumnName: "smallTalkId" }])
  smallTalk: Relation<SmallTalk>;


  private setSmallTalkId(smallTalkId:number){
    if(smallTalkId === null)throw new InternalServerErrorException (`${__dirname} : smallTalkId 값이 존재하지 않습니다.`);
    this.smallTalkId=smallTalkId;
  }

  private setContent(content:string){
    if(content=== null)throw new InternalServerErrorException (`${__dirname} : content값이 존재하지 않습니다.`);
    this.content=content;
  }

  private setAffiliationId(affiliationId:number){
    if(affiliationId=== null)throw new InternalServerErrorException (`${__dirname} : affiliationId 값이 존재하지 않습니다.`);
    this.affiliationId=affiliationId;
  }
}
