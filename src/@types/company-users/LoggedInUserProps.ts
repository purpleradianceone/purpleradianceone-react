export type LoggedInUserProps = {
    userId : number;
    companyId : number;
    message : string;
    token : string;
    status : boolean;
    email : string;
    companyName: string ;
    // name : string;
    fullname? :string
};  

export type LoggedInUserContextProps = {
    loginStatus : LoggedInUserProps;
    setLoginStatus : (loginStatusState: LoggedInUserProps) => void;

};



// {user_id: 15, company_id: 3, message: 'Login Successfully!', token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJpZFwiOjE1LFwiY…Q5UJFGnME8SpBzsvphfZEvKTtdWjPt61-5s0t97Jbq9lV_62A', status: true}
// company_id
// : 
// 3
// message
// : 
// "Login Successfully!"
// status
// : 
// true
// token
// : 
// "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJpZFwiOjE1LFwiY29tcGFueV9pZFwiOjMsXCJjb21wYW55X2Rlc2lnbmF0aW9uX2lkXCI6MCxcImNvbXBhbnlkZXNpZ25hdGlvbm5hbWVcIjpudWxsLFwibmFtZVwiOm51bGwsXCJnZW5kZXJuYW1lXCI6bnVsbCxcIm1hcml0YWxzdGF0dXNuYW1lXCI6bnVsbCxcIm1vYmlsZW51bWJlclwiOlwiODMyOTY3NDQwMVwiLFwiZW1haWxcIjpcInZhaWJoYXYuc2hpbmRlQHB1cnBsZXJhZGlhbmNlLmNvbVwiLFwibG9naW5fdXNlcm5hbWVcIjpudWxsLFwibG9naW5fcGFzc3dvcmRcIjpudWxsLFwiY3JlYXRlZGJ5X3VzZXJcIjpudWxsLFwiaXNhY3RpdmVcIjp0cnVlLFwiY3JlYXRlZG9uXCI6XCIyMDI1LTAxLTE1IDE0OjQxOjA3LjM0XCIsXCJvdHBcIjpudWxsfSIsImlhdCI6MTczNjk0MTg5NCwiZXhwIjoxNzM3OTQxODk0fQ.W00gj3g40FL1uXB8LHQdW9e7o2Nf-7mO6C2X-Q5UJFGnME8SpBzsvphfZEvKTtdWjPt61-5s0t97Jbq9lV_62A"
// user_id
// : 
// 15