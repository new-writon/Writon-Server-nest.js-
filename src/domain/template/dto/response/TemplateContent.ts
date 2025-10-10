import { InternalServerErrorException } from '@nestjs/common';
import { Affiliation } from '../../../user/domain/entity/Affiliation';
import { QuestionContent } from '../../domain/entity/QuestionContent';
import { Question } from '../../../challenge/domain/entity/Question';

export class TemplateContent {
  private position: string;
  private nickname: string;
  public company: string;
  private companyPublic: boolean;
  private profile: string | null;
  private questionId: number;
  public userTemplateId: number;
  private questionContentId: number;
  private content: string;
  private createdAt: string;
  private visibility: boolean;
  private category: string;
  private question: string;
  private affiliationId: number;
  private likeCount: string;
  private commentCount: string;
  private myLikeSign: string;

  constructor(
    position: string,
    nickname: string,
    company: string,
    companyPublic: boolean,
    profile: string | null,
    questionId: number,
    userTempleteId: number,
    questionContentId: number,
    content: string,
    createdAt: string,
    visibility: boolean,
    category: string,
    question: string,
    affiliationId: number,
    likeCount: string,
    commentCount: string,
    myLikeSign: string,
  ) {
    this.setPosition(position);
    this.setNickname(nickname);
    this.setCompany(company);
    this.setCompanyPublic(companyPublic);
    this.setProfile(profile);
    //  this.affiliationData=affiliationData
    this.setQuestionId(questionId);
    this.setUserTempleteId(userTempleteId);
    this.setQuestionContentId(questionContentId);
    this.setContent(content);
    this.setCreatedAt(createdAt);
    this.setVisibility(visibility);
    this.setCategory(category);
    this.setQuestion(question);
    this.setAffiliationId(affiliationId);
    this.setLikeCount(likeCount);
    this.setCommentCount(commentCount);
    this.setMyLikeSign(myLikeSign);
  }

  public static of(
    affiliationData: Affiliation,
    questionId: number,
    userTempleteId: number,
    questionContent: QuestionContent,
    createdAt: string,
    question: Question,
    likeCount: string,
    commentCount: string,
    myLikeSign: string,
  ) {
    return new TemplateContent(
      affiliationData.getPosition(),
      affiliationData.getNickname(),
      affiliationData.getCompany(),
      affiliationData.getCompanyPublic(),
      affiliationData.getUser().getProfileImage(),
      questionId,
      userTempleteId,
      questionContent.getId(),
      questionContent.getContent(),
      createdAt,
      questionContent.getVisibility(),
      question.getCategory(),
      question.getQuestion(),
      affiliationData.getId(),
      likeCount,
      commentCount,
      myLikeSign,
    );
  }

  private setPosition(position: string): void {
    if (position === null) {
      throw new InternalServerErrorException(`${__dirname} : position 값이 존재하지 않습니다.`);
    }
    this.position = position;
  }

  private setNickname(nickname: string): void {
    if (nickname === null) {
      throw new InternalServerErrorException(`${__dirname} : nickname 값이 존재하지 않습니다.`);
    }
    this.nickname = nickname;
  }

  private setCompany(company: string): void {
    if (company === null) {
      throw new InternalServerErrorException(`${__dirname} : company 값이 존재하지 않습니다.`);
    }
    this.company = company;
  }

  private setCompanyPublic(companyPublic: boolean): void {
    if (companyPublic === null) {
      throw new InternalServerErrorException(
        `${__dirname} : companyPublic 값이 존재하지 않습니다.`,
      );
    }
    this.companyPublic = companyPublic;
  }

  private setProfile(profile: string | null): void {
    this.profile = profile;
  }

  private setQuestionId(questionId: number): void {
    if (questionId === null) {
      throw new InternalServerErrorException(`${__dirname} : questionId 값이 존재하지 않습니다.`);
    }
    this.questionId = questionId;
  }

  private setUserTempleteId(userTemplateId: number): void {
    if (userTemplateId === null) {
      throw new InternalServerErrorException(
        `${__dirname} : userTemplateId값이 존재하지 않습니다.`,
      );
    }
    this.userTemplateId = userTemplateId;
  }

  private setQuestionContentId(questionContentId: number): void {
    if (questionContentId === null) {
      throw new InternalServerErrorException(
        `${__dirname} : questionContentId 값이 존재하지 않습니다.`,
      );
    }
    this.questionContentId = questionContentId;
  }

  private setContent(content: string): void {
    if (content === null) {
      throw new InternalServerErrorException(`${__dirname} : content 값이 존재하지 않습니다.`);
    }
    this.content = content;
  }

  private setCreatedAt(createdAt: string): void {
    if (createdAt === null) {
      throw new InternalServerErrorException(`${__dirname} : createdAt 값이 존재하지 않습니다.`);
    }
    this.createdAt = createdAt;
  }

  private setVisibility(visibility: boolean): void {
    if (visibility === null) {
      throw new InternalServerErrorException(`${__dirname} : visibility 값이 존재하지 않습니다.`);
    }
    this.visibility = visibility;
  }

  private setCategory(category: string): void {
    if (category === null) {
      throw new InternalServerErrorException(`${__dirname} : category 값이 존재하지 않습니다.`);
    }
    this.category = category;
  }

  private setQuestion(question: string): void {
    if (question === null) {
      throw new InternalServerErrorException(`${__dirname} : question 값이 존재하지 않습니다.`);
    }
    this.question = question;
  }

  private setLikeCount(likeCount: string): void {
    if (likeCount === null) {
      throw new InternalServerErrorException(`${__dirname} : likeCount 값이 존재하지 않습니다.`);
    }
    this.likeCount = likeCount;
  }

  private setCommentCount(commentCount: string): void {
    if (commentCount === null) {
      throw new InternalServerErrorException(`${__dirname} : commentCount 값이 존재하지 않습니다.`);
    }
    this.commentCount = commentCount;
  }

  private setMyLikeSign(myLikeSign: string): void {
    if (myLikeSign === null) {
      throw new InternalServerErrorException(`${__dirname} : myLikeSign 값이 존재하지 않습니다.`);
    }
    this.myLikeSign = myLikeSign;
  }

  private setAffiliationId(affiliationId: number) {
    if (affiliationId === null) {
      throw new InternalServerErrorException(
        `${__dirname} : affiliationId 값이 존재하지 않습니다.`,
      );
    }
    this.affiliationId = affiliationId;
  }

  public getCompanyPublic() {
    return this.companyPublic;
  }

  public changeCompany(company: string | null) {
    return (this.company = company);
  }
}

export class TemplateContentArray {
  templateContentArray: TemplateContent[][];

  constructor(templateContentArray: TemplateContent[][]) {
    this.templateContentArray = templateContentArray;
  }

  public static of(templateContentArray: TemplateContent[][]) {
    return new TemplateContentArray(templateContentArray);
  }
}
