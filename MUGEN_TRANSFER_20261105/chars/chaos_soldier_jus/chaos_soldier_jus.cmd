[Remap]
x=x
y=y
z=z
a=a
b=b
c=c
s=s
[Defaults]
command.time=20
command.buffer.time=3

[Command]
name="s1"
command=~D,DF,F,a
time=25

[Command]
name="s1"
command=~D,DF,F,x
time=25

[Command]
name="s2"
command=~D,DB,B,a
time=25

[Command]
name="s2"
command=~D,DB,B,x
time=25

[Command]
name="s3"
command=~D,DF,F,b
time=25

[Command]
name="s3"
command=~D,DF,F,y
time=25

[Command]
name="s4"
command=~D,DB,B,b
time=25

[Command]
name="s4"
command=~D,DB,B,y
time=25

[Command]
name="h1"
command=~D,DF,F,c
time=25

[Command]
name="h1"
command=~D,DF,F,z
time=25

[Command]
name="h2"
command=~D,DB,B,c
time=25

[Command]
name="h2"
command=~D,DB,B,z
time=25

[Command]
name="h3"
command=a+b+c
time=25

[Command]
name="h3"
command=x+y+z
time=25

[Command]
name="s1"
command=a+c
time=25

[Command]
name="s1"
command=x+z
time=25

[Command]
name="s2"
command=b+c
time=25

[Command]
name="s2"
command=y+z
time=25

[Command]
name="s3"
command=a+b
time=25

[Command]
name="s3"
command=x+y
time=25

[Command]
name="FF"
command=F,F
time=25

[Command]
name="BB"
command=B,B
time=25

[Command]
name="a"
command=a
time=25

[Command]
name="a"
command=x
time=25

[Command]
name="b"
command=b
time=25

[Command]
name="b"
command=y
time=25

[Command]
name="c"
command=c
time=25

[Command]
name="c"
command=z
time=25

[Command]
name="holdfwd"
command=/$F
time=25

[Command]
name="holdback"
command=/$B
time=25

[Command]
name="holdup"
command=/$U
time=25

[Command]
name="holddown"
command=/$D
time=25

[Command]
name="recovery"
command=a+b
time=25

[Command]
name="recovery"
command=x+y
time=25

[Statedef -1]

[State -1, h3]
type=ChangeState
value=3200
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="h3" && command!="holddown" && command!="holdfwd"
triggerall=StateType!=A && Power>=2000
trigger1=Ctrl
trigger2=StateNo=[200,220]
trigger2=MoveContact

[State -1, h1]
type=ChangeState
value=3000
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="h1" || (command="h3" && command="holddown")
triggerall=StateType!=A && Power>=1000
trigger1=Ctrl
trigger2=StateNo=[200,220]
trigger2=MoveContact

[State -1, h2]
type=ChangeState
value=3100
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="h2" || (command="h3" && command="holdfwd")
triggerall=StateType!=A && Power>=1000
trigger1=Ctrl
trigger2=StateNo=[200,220]
trigger2=MoveContact

[State -1, s4]
type=ChangeState
value=1300
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="s4" || (command="s3" && command="holddown")
triggerall=StateType!=A && Power>=0
trigger1=Ctrl
trigger2=StateNo=[200,220]
trigger2=MoveContact

[State -1, s3]
type=ChangeState
value=1200
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="s3"
triggerall=StateType!=A && Power>=0
trigger1=Ctrl
trigger2=StateNo=[200,220]
trigger2=MoveContact

[State -1, s2]
type=ChangeState
value=1100
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="s2"
triggerall=StateType!=A && Power>=0
trigger1=Ctrl
trigger2=StateNo=[200,220]
trigger2=MoveContact

[State -1, s1]
type=ChangeState
value=1000
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="s1"
triggerall=StateType!=A && Power>=0
trigger1=Ctrl
trigger2=StateNo=[200,220]
trigger2=MoveContact

[State -1, run]
type=ChangeState
value=100
triggerall=!IsHelper && RoundState=2 && AILevel=0
trigger1=command="FF" && Ctrl && StateType=S

[State -1, backhop]
type=ChangeState
value=105
triggerall=!IsHelper && RoundState=2 && AILevel=0
trigger1=command="BB" && Ctrl && StateType=S

[State -1, air a]
type=ChangeState
value=600
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="a" && StateType=A
trigger1=Ctrl

[State -1, low a]
type=ChangeState
value=400
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="a" && command="holddown" && StateType!=A
trigger1=Ctrl

[State -1, a]
type=ChangeState
value=200
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="a" && StateType!=A
trigger1=Ctrl

[State -1, air b]
type=ChangeState
value=610
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="b" && StateType=A
trigger1=Ctrl
trigger2=StateNo=600 && MoveContact

[State -1, low b]
type=ChangeState
value=410
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="b" && command="holddown" && StateType!=A
trigger1=Ctrl

[State -1, b]
type=ChangeState
value=210
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="b" && StateType!=A
trigger1=Ctrl
trigger2=StateNo=200 && MoveContact

[State -1, air c]
type=ChangeState
value=610
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="c" && StateType=A
trigger1=Ctrl

[State -1, low c]
type=ChangeState
value=410
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="c" && command="holddown" && StateType!=A
trigger1=Ctrl

[State -1, c]
type=ChangeState
value=220
triggerall=!IsHelper && RoundState=2 && AILevel=0
triggerall=command="c" && StateType!=A
trigger1=Ctrl
trigger2=StateNo=210 && MoveContact


[State -1, AI reactive low guard]
type=ChangeState
value=131
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && InGuardDist && P2BodyDist X>=0
triggerall=var(53)>=10-floor(AILevel/2)
trigger1=P2MoveType=A && P2StateType=C && Random<100+AILevel*70

[State -1, AI reactive high guard]
type=ChangeState
value=130
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && InGuardDist && P2BodyDist X>=0
triggerall=var(53)>=10-floor(AILevel/2)
trigger1=P2MoveType=A && P2StateType!=C && Random<100+AILevel*70

[State -1, AI second slash]
type=ChangeState
value=210
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=200 && MoveContact && Time>=6

[State -1, AI finishing slash]
type=ChangeState
value=220
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=210 && MoveContact && Time>=8

[State -1, AI air followup]
type=ChangeState
value=610
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=600 && MoveContact && Time>=4

[State -1, AI ground eruption]
type=ChangeState
value=3200
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=StateType!=A && Ctrl
triggerall=P2BodyDist X>=0
triggerall=Power>=2000 && var(50)=0 && var(51)!=3200
trigger1=P2BodyDist X<180 && P2StateType!=L && Random<25+AILevel*3

[State -1, AI close whirlwind]
type=ChangeState
value=3100
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=StateType!=A && Ctrl
triggerall=P2BodyDist X>=0
triggerall=Power>=1000 && var(50)=0 && var(51)!=3100
trigger1=P2BodyDist X<75 && P2StateType!=L && Random<20+AILevel*3

[State -1, AI chaos blade]
type=ChangeState
value=3000
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=StateType!=A && Ctrl
triggerall=P2BodyDist X>=0
triggerall=Power>=1000 && var(50)=0 && var(51)!=3000
trigger1=P2BodyDist X<260 && P2StateType!=L && Random<22+AILevel*3

[State -1, AI anti air]
type=ChangeState
value=1200
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=StateType!=A && Ctrl
triggerall=P2BodyDist X>=0
triggerall=var(50)=0 && var(51)!=1200
trigger1=P2StateType=A && P2Dist Y<-15 && P2BodyDist X<70 && Random<70+AILevel*15

[State -1, AI energy blade]
type=ChangeState
value=1000
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=StateType!=A && Ctrl
triggerall=P2BodyDist X>=0
triggerall=var(50)=0 && var(51)!=1000
trigger1=P2BodyDist X>75 && P2BodyDist X<260 && P2StateType!=L && Random<35+AILevel*6

[State -1, AI shield rush]
type=ChangeState
value=1100
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=StateType!=A && Ctrl
triggerall=P2BodyDist X>=0
triggerall=var(50)=0 && var(51)!=1100
trigger1=P2BodyDist X>15 && P2BodyDist X<65 && P2StateType!=L && Random<35+AILevel*6

[State -1, AI sword sequence]
type=ChangeState
value=1300
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=StateType!=A && Ctrl
triggerall=P2BodyDist X>=0
triggerall=var(50)=0 && var(51)!=1300
trigger1=P2BodyDist X>35 && P2BodyDist X<90 && P2StateType!=L && Random<35+AILevel*6

[State -1, AI close slash]
type=ChangeState
value=200
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=StateType!=A && Ctrl
triggerall=P2BodyDist X>=0
trigger1=P2BodyDist X<48 && P2StateType!=L && Random<180+AILevel*25

[State -1, AI approach]
type=ChangeState
value=100
triggerall=!IsHelper && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=StateType!=A && Ctrl
triggerall=P2BodyDist X>=0
trigger1=P2BodyDist X>65 && Random<90+AILevel*12
