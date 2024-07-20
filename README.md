<h1>협업 시스템 프로젝트</h1>

<h3>개발 환경</h3>

- 사용 언어 : JavaScript
- 개발 IDE : VSCode
- 프레임워크 : Node.JS, BootStrap

<h3>개발 내용</h3>

- Zira를 벤치마킹하여 협업 시스템 프로젝트를 진행
- 협업 툴의 절차 간소화를 목표로 함

<h3>개발 일정</h3>

24.04.11 ~ 24.04.25

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/8bf71d0c-0641-44ce-a9cd-503e8f320e5e)

<h3>업무 분담</h3>

- 팀원 : 6명

| 팀원명  | 업무 |
| ------------- | ------------- |
| 구영모(팀장) | -기여도 기능 구현 <br>-회원가입기능 구현<br>-회원상태 기반코드 작성 |
| 김준형 | -게시판기능 구현<br>-로그인기능 구현<br>-채팅기능 구현<br>-회원상태 코드 고도화 및 세션 관리 <br>-기능 통합 및 페이지 로딩 순서 관리 |
| 김재환  | -게시판 기반코드 작성 |
| 박지혜  | - 정보리스트 (모든인원, 팀, 본인) 기능 구현  |
| 설송희 | -코드 게시판 기능 구현 |
| 이소래  | -일정(캘린더) 기능 구현<br>-팀 배정 기능 구현  |

<h1>프로젝트 상세 내용</h1>

<h2>프로그램 구조 및 ERD 다이어그램</h2>

<h3>프로그램 구조</h3>

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/e17d8004-0281-41fd-ac0f-49b5e329d294)

<h3>ERD 다이어그램</h3>

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/3dedf581-3499-43f6-906b-666e7bf309d6)

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/6589f704-b263-4376-ab12-93a5011e29af)

<h2>구현 목표</h2>

| 회원 관리 기능
1. 직원 회원 관리
2. 인적정보 및 팀 정보
3. 팀 정보 수정 기능

| 게시판 기능
1. 자유 게시판 기능
2. 코드 게시판 기능

| 그 외 기능
1. 채팅 기능
2. 일정 관리 기능(캘린더)

<h2>나의 역할</h2>

- 일정 관리 기능(캘린더)
- 팀 정보 수정 기능

<h3>일정 관리 기능(캘린더)</h3>

- 사용 라이브러리 : FullCalendar
- 공식 문서 : https://fullcalendar.io/
- 언어 : JavaScript
- CDN 랜딩을 연결하여 API로 해당 기능을 동작
  : https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js

<h4>전체 기능</h4>

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/9a3fb6b6-a252-47da-8457-457a258a0c2c)

<h4>일정 추가</h4>

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/13498dd0-6954-41f4-88d3-3d200291a993)

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/5d7ab9b0-04cb-470a-b2ae-dba1ca4958d6)

<h4>일정 수정 및 삭제하기</h4>

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/c9b323d4-b95c-4b6b-9b96-2c9371746aab)

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/c8fa4b71-df44-41a3-bc8d-d8b471feff23)

<h4>Team별 데이터 분리</h4>

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/3b8d028e-522b-4b4f-b1b1-0e5a06be29d4)

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/9232b323-e107-489b-8039-1d9c8f15f72e)

<h4>개인 일정</h4>

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/c63eb1a2-d467-422e-8692-5cf5179b6bf4)

<h4>기타 기능</h4>
: Google Calendar API로 공휴일 가져오기

- FullCalendar에서 지원하는 Google Calendar 연결기능을 활용
- CDN 랜딩 연결 :  https://cdn.jsdelivr.net/npm/@fullcalendar/google-calendar@6.1.11/index.global.min.js
- Google Calendar의 사용자 API 키를 발급
- 본인 Google Calendar에서 공휴일 캘린더의 ID를 가져와 eventSources에 연동

<h3>팀 정보 수정 기능</h3>

<h4>팀 생성/수정/삭제 기능</h4>

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/df054d3f-014d-42af-b62a-4f15a8fad98a)

: dev ,client로 로그인 시 → 사용자에 대한 정보 확인만 가능

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/16c2a07d-0b49-422b-8cfb-811fde6776d8)

: PM으로 로그인 시 → 팀 생성/수정/삭제 가능
→ 데이터베이스에서 Insert / Update / Delete가 조건에 맞게 운영됨

<h4>팀 정보 수정 기능</h4>

![image](https://github.com/soraelee/teamProject_CollabSystem/assets/145763590/4bf62c5d-28a7-483e-b6b8-24c6857e2968)

<h2>문제점</h2>

- 데이터 베이스 버전 문제로 오류가 있었습니다. 
- 11버전에서 19버전으로 수정 중 다른 팀원들의 코드들과 호환이 되지 않아 문제가 발생했었습니다
