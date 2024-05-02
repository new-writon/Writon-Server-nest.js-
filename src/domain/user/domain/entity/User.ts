import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation
} from "typeorm";
import { Affiliation } from "./Affiliation.js";
import { BaseEntity } from "../../../../global/entity/Base.Entitiy.js";
import { InternalServerErrorException } from "@nestjs/common";

@Index("User_identifier_key", ["identifier"], { unique: true })
@Index("User_email_key", ["email"], { unique: true })
@Entity("User", { schema: "nest" })
export class User extends BaseEntity{


  constructor(   
    email: string,
    kakaoNumber: string,
    kakaoProfileImage: string,
    role: string
  ){
        super();
        this.setEmail(email),
        this.setKakaoIdentifier(kakaoNumber),
        this.setKakaoProfileImage(kakaoNumber),
        this.setRole(role)
    }


  @PrimaryGeneratedColumn({ type: "int", name: "user_id" })
  userId: number;

  @Column("varchar", { name: "role", length: 20 })
  role: string;

  @Column("varchar", { name: "identifier", unique: true, length: 40 })
  identifier: string;

  @Column("varchar", { name: "password", nullable: true, length: 255 })
  password: string | null;

  @Column("varchar", { name: "email", unique: true, length: 40 })
  email: string;

  @Column("varchar", { name: "profile", nullable: true, length: 500 })
  profile: string | null;

  @Column("varchar", { name: "account_number", nullable: true, length: 40 })
  accountNumber: string | null;

  @Column("varchar", { name: "bank", nullable: true, length: 20 })
  bank: string | null;

  @OneToMany(() => Affiliation, (affiliation) => affiliation.user)
  affiliations: Relation<Affiliation>[];



  public static createKakaoUser(
    email: string,
    kakaoNumber: string,
    kakaoProfileImage: string,
    role: string,
  ){
    return new User(email, kakaoNumber, kakaoProfileImage, role)
  } 


  private setEmail(email: string){
    if(email === null) throw new InternalServerErrorException (`${__dirname} : Email 값이 존재하지 않습니다.`);
    this.email=email;
  }

  private setKakaoIdentifier(kakaoNumber: string){
    if(kakaoNumber === null) throw new InternalServerErrorException (`${__dirname} : KakaoNumber 값이 존재하지 않습니다.`);
    this.identifier=kakaoNumber;
  }

  private setRole(role: string){
    if(role === null) throw new InternalServerErrorException (`${__dirname} : Role 값이 존재하지 않습니다.`);
    this.role=role;
  }

  private setKakaoProfileImage(profileImage: string){
    if(profileImage === null) throw new InternalServerErrorException (`${__dirname} : ProfileImage 값이 존재하지 않습니다.`);
    this.profile=profileImage;
  }


  public getEmail(): string{

    return this.email;
  }

  public getKakaoIdentifier(): string{

    return this.identifier;
  }

  public getRole(): string{
  
    return this.role;
  }

  public getKakaoProfileImage(): string{
    return this.profile;
  }

  public getUserId(): number{
    return this.userId;
  }

  public getPassword(): string{
    return this.password;
  }



}
