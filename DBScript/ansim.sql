create table table_log
(
    logid      int auto_increment comment '로그ID'
        primary key,
    userid     varchar(100) null comment '사용자ID',
    username   varchar(100) null comment '사용자이름',
    category   varchar(100) null comment '로그분류',
    action     varchar(100) null comment '로그행위',
    ip         varchar(50)  null comment 'IP주소',
    agent      varchar(50)  null comment '에이전트',
    result     char         null comment '결과',
    reason     text         null comment '사유 또는 데이터',
    createdate datetime     null comment '로그일시'
)
    comment '감사로그를 관리한다.';

create table table_position
(
    positionid varchar(50) not null comment '직책ID'
        primary key,
    pcode      varchar(50) null comment '직책코드',
    name       varchar(50) null comment '직책명',
    createdate datetime    null comment '등록일시',
    updatedate datetime    null comment '수정일시'
)
    comment '직책정보를 관리한다.';

create table table_member
(
    userid     varchar(100) not null comment '사용자ID'
        primary key,
    username   varchar(100) null comment '사용자이름',
    password   varchar(128) null comment '비밀번호',
    email      varchar(256) null comment '이메일주소',
    cellno     varchar(50)  null comment '휴대 전화번호',
    uuid       varchar(50)  null comment '고유코드',
    otpKey     varchar(50)  null comment 'Google OTP키',
    positionid varchar(50)  null comment '직책ID',
    status     varchar(16)  null comment '사용자상태',
    salt       varchar(50)  null comment 'Salt',
    createdate datetime     null comment '등록일시',
    updatedate datetime     null comment '수정일시',
    deletedate datetime     null comment '삭제일시',
    constraint table_member_table_position_positionid_fk
        foreign key (positionid) references table_position (positionid)
            on update cascade on delete cascade
)
    comment '사용자정보를 관리한다.';

create table table_agent
(
    agentid     varchar(50)  not null comment '아이디'
        primary key,
    userid      varchar(100) null comment '사용자 아이디',
    ip          varchar(50)  null comment 'IP주소',
    version     varchar(50)  null comment '에이전트 버전',
    type        varchar(16)  null comment '에이전트 유형(PC, USB)',
    path        varchar(256) null comment '설치위치',
    status      varchar(16)  null comment '현재상태',
    code        varchar(50)  null comment '설치코드',
    deletable   char         null comment '삭제가능여부',
    createdate  datetime     null comment '최초 접속 일시',
    approvedate datetime     null comment '등록일시',
    stopdate    datetime     null comment '정지일시',
    deletedate  datetime     null comment '삭제일시',
    constraint table_agent___fk_userid
        foreign key (userid) references table_member (userid)
            on update cascade on delete cascade
)
    comment '에이전트 정보를 관리한다.';

create table table_auth
(
    authid     int auto_increment comment '아이디'
        primary key,
    userid     varchar(100) null comment '사용자 아이디',
    auth       varchar(50)  null comment '권한',
    createdate datetime     null comment '할당일시',
    constraint table_role___fk_userid
        foreign key (userid) references table_member (userid)
            on update cascade on delete cascade
)
    comment '사용자의 권한정보를 관리한다.';

create table table_dept
(
    deptid     varchar(50)  not null comment '부서ID'
        primary key,
    deptcode   varchar(50)  null comment '부서코드',
    pid        varchar(50)  null comment '상위부서ID',
    parent     char         null comment '상위부서여부',
    chiefid    varchar(100) null comment '부서장',
    name       varchar(100) null comment '부서명',
    lft        int          null comment '범위시작',
    rgt        int          null comment '범위종료',
    area       linestring   null comment '범위벡터',
    enabled    char         null comment '사용여부',
    createdate datetime     null comment '생성일시',
    updatedate datetime     null comment '수정일시',
    constraint table_dept_table_member_userid_fk
        foreign key (chiefid) references table_member (userid)
            on update cascade on delete set null
)
    comment '부서정보를 관리한다.';

create index table_dept__index_area
    on table_dept (area(3072));

create table table_dept_admin
(
    deptadminid int auto_increment comment 'ID'
        primary key,
    deptid      varchar(50)  null comment '부서ID',
    userid      varchar(100) null comment '사용자ID',
    assigndate  datetime     null comment '할당일시',
    constraint table_dept_admin___fk_deptid
        foreign key (deptid) references table_dept (deptid)
            on update cascade on delete cascade,
    constraint table_dept_admin___fk_userid
        foreign key (userid) references table_member (userid)
            on update cascade on delete cascade
)
    comment '부서의 관리자 정보를 관리한다.';

create table table_dept_member
(
    deptmemberid int auto_increment comment 'ID'
        primary key,
    deptid       varchar(50)  null comment '부서ID',
    userid       varchar(100) null comment '사용자ID',
    assigndate   datetime     null comment '소속일시',
    constraint table_dept_member___fk_deptid
        foreign key (deptid) references table_dept (deptid)
            on update cascade on delete cascade,
    constraint table_dept_member___fk_userid
        foreign key (userid) references table_member (userid)
            on update cascade on delete cascade
)
    comment '부서의 사용자정보를 관리한다.';

create table table_password_history
(
    id         int auto_increment comment '아이디'
        primary key,
    userid     varchar(100) null comment '사용자ID',
    userpw     varchar(128) null comment '비밀번호',
    createdate datetime     null comment '변경일시',
    constraint table_password_history___fk_userid
        foreign key (userid) references table_member (userid)
            on update cascade on delete cascade
)
    comment '비밀번호 변경이력을 관리한다.';

create table table_system_config
(
    id       int auto_increment comment '아이디'
        primary key,
    category varchar(100) not null comment '설정 카테고리',
    name     varchar(100) not null comment '설정이름',
    value    text         null comment '설정값'
)
    comment '시스템 설정 정보를 관리한다.';

