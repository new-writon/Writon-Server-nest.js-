import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation
} from "typeorm";
import { Challenge } from "./Challenge.js";
import { BaseEntity } from "../../../../global/entity/Base.Entitiy.js";


@Index("ChallengeDay_challenge_id_fkey", ["challenge_id"], {})
@Entity("ChallengeDay", { schema: "nest" })
export class ChallengeDay extends BaseEntity{
  @PrimaryGeneratedColumn({ type: "int", name: "challenge_day_id" })
  challenge_day_id: number;

  @Column("int", { name: "challenge_id" })
  challenge_id: number;

  @Column("date", { name: "day" })
  day: Date;

  @ManyToOne(() => Challenge, (challenge) => challenge.challengeDays, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "challenge_id", referencedColumnName: "challenge_id" }])
  challenge: Relation<Challenge>;


  public getDay(): Date{
    return this.day;
  }
  
}
