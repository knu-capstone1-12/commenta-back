# VOICE Interface 활용 감정 일기 백엔드 소프트웨어

VOICE Interface 활용 감정 일기 프로젝트의 백엔드 소프트웨어입니다.

## 주요 기능 소개

STT 기반의 감정 일기 작성을 가능하게 해 주는 서버 모듈로, 프론트엔드 소프트웨어와 연동되어 동작합니다.
Google Cloud Platform 및 Amazon Cloud Service Transcribe 기반의 STT 모듈이 있어, 정확하고 빠른 음성 인식이 가능합니다.
OpenAI를 이용한 Prompt Engineering으로 Sentiment 분석이 가능하고, Naver Clova 기반의 Sentiment 점수 분석이 가능합니다.

## 🔨 사용된 프레임워크 및 오픈 소스 소프트웨어

<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/amazon s3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white"> <img src="https://img.shields.io/badge/Google Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white"> 

## 💻 설치 및 사용 방법

1. npm install 또는 yarn install로 프로그램 실행에 필요한 모듈들을 설치합니다.
   ```shell
   npm install
   ```
2. .env에 AWS 및 Google Cloud Platform에 필요한 환경 변수가 설정되어 있어야 합니다.
   
REGION: AWS의 Region을 설정합니다.

ACCESSKEYID: AWS에서 발급받은 Access Key ID

SECRETACCESSKEY: AWS에서 발급받은 Secret Access Key

NCPID: Naver Cloud Platform에서 발급받은 ID

NCPKEY: Naver Cloud Platform에서 발급받은 Key

OPENAI_API_KEY: OpenAI 프롬프트 엔지니어링을 위한 OpenAI API Key

Google Cloud Platform의 경우 시스템 환경변수로 설정해 주십시오.
(GOOGLE_APPLICATIONS_CREDENTIALS)

3. node app을 이용하여 서버를 실행해 주십시오.

## 💛 개발자

한의진(Backend API 및 클라우드 연동 담당), 김태환(Cloud Sentiment 모듈 담당)

## 🎯 기여 및 오류 제보

버그 및 오류 제보, 기여는 언제든 환영합니다.

이 소프트웨어는 Atlaslabs와 협력한 종합설계프로젝트(산학프로젝트)로서 기여 시 미리 이메일로 연락주시기 바랍니다.

