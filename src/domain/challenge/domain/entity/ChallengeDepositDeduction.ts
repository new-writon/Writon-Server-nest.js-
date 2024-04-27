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


@Index("ChallengeDepositDeduction_challenge_id_fkey", ["challengeId"], {})
@Entity("ChallengeDepositDeduction", { schema: "nest" })
export class ChallengeDepositDeduction extends BaseEntity{
  @PrimaryGeneratedColumn({
    type: "int",
    name: "challenge_deposit_deduction_id",
  })
  challengeDepositDeductionId: number;

  @Column("int", { name: "challenge_id" })
  challengeId: number;

  @Column("int", { name: "start_count" })
  startCount: number;
  
  @Column("int", { name: "deduction_amount" })
  deductionAmount: number;

  @Column("int", { name: "end_count" })
  endCount: number;

  @ManyToOne(
    () => Challenge,
    (challenge) => challenge.challengeDepositDeductions,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "challenge_id", referencedColumnName: "challengeId" }])
  challenge: Relation<Challenge>;
}
