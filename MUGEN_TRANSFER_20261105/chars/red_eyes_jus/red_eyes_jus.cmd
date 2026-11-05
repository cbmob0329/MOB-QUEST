[Remap]
x=x
y=y
z=z
a=a
b=b
c=c
s=s
[Defaults]
command.time = 12
command.buffer.time = 3

[Command]
name = "FF"
command = F,F
time = 12

[Command]
name = "BB"
command = B,B
time = 12

[Command]
name = "holdfwd"
command = /$F
time = 12

[Command]
name = "holdback"
command = /$B
time = 12

[Command]
name = "holdup"
command = /$U
time = 12

[Command]
name = "holddown"
command = /$D
time = 12

[Command]
name = "recovery"
command = x+y
time = 12

[Command]
name = "throw"
command = x+y
time = 12

[Command]
name = "x"
command = x
time = 12

[Command]
name = "y"
command = y
time = 12

[Command]
name = "z"
command = z
time = 12

[Command]
name = "a"
command = a
time = 12

[Command]
name = "b"
command = b
time = 12

[Command]
name = "c"
command = c
time = 12

[Command]
name = "s"
command = s
time = 12

[Command]
name = "S1"
command = a
time = 12

[Command]
name = "S2"
command = /F,a
time = 12

[Command]
name = "S3"
command = /D,a
time = 12

[Command]
name = "S4"
command = /B,a
time = 12

[Command]
name = "U1"
command = b
time = 12

[Command]
name = "U2"
command = /F,b
time = 12

[Command]
name = "U3"
command = c
time = 12

[Command]
name = "U4"
command = /D,c
time = 12

[Statedef -1]

[State -1, U4]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "U4" && StateType != A && (ctrl || (MoveHit && StateNo >= 200 && StateNo < 800)) && Power >= 2000
value = 1700

[State -1, U3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "U3" && StateType != A && (ctrl || (MoveHit && StateNo >= 200 && StateNo < 800)) && Power >= 2000
value = 1600

[State -1, U2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "U2" && StateType != A && (ctrl || (MoveHit && StateNo >= 200 && StateNo < 800)) && Power >= 1000
value = 1500

[State -1, U1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "U1" && StateType != A && (ctrl || (MoveHit && StateNo >= 200 && StateNo < 800)) && Power >= 1000
value = 1400

[State -1, S4]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "S4" && StateType != A && (ctrl || (MoveHit && StateNo >= 200 && StateNo < 800)) && Power >= 0
value = 1300

[State -1, S3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "S3" && StateType != A && (ctrl || (MoveHit && StateNo >= 200 && StateNo < 800)) && Power >= 0
value = 1200

[State -1, S2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "S2" && StateType != A && (ctrl || (MoveHit && StateNo >= 200 && StateNo < 800)) && Power >= 0
value = 1100

[State -1, S1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "S1" && StateType != A && (ctrl || (MoveHit && StateNo >= 200 && StateNo < 800)) && Power >= 0
value = 1000

[State -1, True airborne U1]
type = ChangeState
triggerall=AILevel=0
triggerall = command = "U1" && command != "U2" && StateType = A && Ctrl
trigger1 = !IsHelper && Alive && RoundState = 2 && Pos Y < 0 && Power >= 1000 && NumEnemy = 1 && NumHelper = 0 && var(41) <= 3 && var(41) >= 0 && var(46) = 0
value = 1850

[State -1, Air throw]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "throw" && StateType = A && ctrl && (EnemyNear, StateType = A) && P2BodyDist X < 35 && Abs(P2Dist Y) < 42 && var(41) < 4
value = 820

[State -1, Throw]
type = ChangeState
triggerall=AILevel=0
trigger1 = StateType != A && command = "throw" && ctrl && P2BodyDist X < 30 && Abs(P2Dist Y) < 45 && ((EnemyNear, StateType != A) || var(41) < 4)
value = 800

[State -1, Second jump]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "holdup" && StateType = A && ctrl && var(43) = 0 && var(44) = 0 && Pos Y < -16
value = 45

[State -1, Fast dash]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "FF" && ctrl && StateType = S
value = 100

[State -1, Back retreat]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "BB" && ctrl && StateType = S
value = 105

[State -1, Sx3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "x" && StateType = S && StateNo = 201 && MoveContact && Time >= 8
value = 202

[State -1, Sx2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "x" && StateType = S && StateNo = 200 && MoveContact && Time >= 8
value = 201

[State -1, Sx1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "x" && StateType = S && ctrl
value = 200

[State -1, Sy3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "y" && StateType = S && StateNo = 211 && MoveContact && Time >= 8
value = 212

[State -1, Sy2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "y" && StateType = S && StateNo = 210 && MoveContact && Time >= 8
value = 211

[State -1, Sy1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "y" && StateType = S && ctrl
value = 210

[State -1, Sz3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "z" && StateType = S && StateNo = 221 && MoveContact && Time >= 8
value = 222

[State -1, Sz2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "z" && StateType = S && StateNo = 220 && MoveContact && Time >= 8
value = 221

[State -1, Sz1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "z" && StateType = S && ctrl
value = 220

[State -1, Cx3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "x" && StateType = C && StateNo = 401 && MoveContact && Time >= 8
value = 402

[State -1, Cx2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "x" && StateType = C && StateNo = 400 && MoveContact && Time >= 8
value = 401

[State -1, Cx1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "x" && StateType = C && ctrl
value = 400

[State -1, Cy3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "y" && StateType = C && StateNo = 411 && MoveContact && Time >= 8
value = 412

[State -1, Cy2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "y" && StateType = C && StateNo = 410 && MoveContact && Time >= 8
value = 411

[State -1, Cy1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "y" && StateType = C && ctrl
value = 410

[State -1, Cz3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "z" && StateType = C && StateNo = 421 && MoveContact && Time >= 8
value = 422

[State -1, Cz2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "z" && StateType = C && StateNo = 420 && MoveContact && Time >= 8
value = 421

[State -1, Cz1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "z" && StateType = C && ctrl
value = 420

[State -1, Ax3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "x" && StateType = A && StateNo = 601 && MoveContact && Time >= 8
value = 602

[State -1, Ax2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "x" && StateType = A && StateNo = 600 && MoveContact && Time >= 8
value = 601

[State -1, Ax1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "x" && StateType = A && ctrl
value = 600

[State -1, Ay3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "y" && StateType = A && StateNo = 611 && MoveContact && Time >= 8
value = 612

[State -1, Ay2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "y" && StateType = A && StateNo = 610 && MoveContact && Time >= 8
value = 611

[State -1, Ay1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "y" && StateType = A && ctrl
value = 610

[State -1, Az3]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "z" && StateType = A && StateNo = 621 && MoveContact && Time >= 8
value = 622

[State -1, Az2]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "z" && StateType = A && StateNo = 620 && MoveContact && Time >= 8
value = 621

[State -1, Az1]
type = ChangeState
triggerall=AILevel=0
trigger1 = command = "z" && StateType = A && ctrl
value = 620

[State -1, AI timed high low defense]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && InGuardDist && P2BodyDist X>=0
triggerall=fvar(36)>=12-floor(AILevel/2)
trigger1=P2MoveType=A && Random<350+AILevel*55
value=ifelse(StateType=A,132,ifelse(P2StateType=C,131,130))

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=200 && MoveContact && Time>=8
value=201

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=201 && MoveContact && Time>=8
value=202

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=210 && MoveContact && Time>=8
value=211

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=211 && MoveContact && Time>=8
value=212

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=220 && MoveContact && Time>=8
value=221

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=221 && MoveContact && Time>=8
value=222

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=400 && MoveContact && Time>=8
value=401

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=401 && MoveContact && Time>=8
value=402

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=410 && MoveContact && Time>=8
value=411

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=411 && MoveContact && Time>=8
value=412

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=420 && MoveContact && Time>=8
value=421

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=421 && MoveContact && Time>=8
value=422

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=600 && MoveContact && Time>=8
value=601

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=601 && MoveContact && Time>=8
value=602

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=610 && MoveContact && Time>=8
value=611

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=611 && MoveContact && Time>=8
value=612

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=620 && MoveContact && Time>=8
value=621

[State -1, AI confirmed chain]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
trigger1=StateNo=621 && MoveContact && Time>=8
value=622


[State -1, AI black dragon invasion]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && P2StateType!=L
triggerall=Power>=2000 && fvar(37)=0 && fvar(38)!=1700
trigger1=(P2BodyDist X=[60,160]) && P2MoveType!=A && Random<45+AILevel*5
value=1700
[State -1, AI range technique 1600]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && P2BodyDist X>=0 && P2StateType!=L
triggerall=Power>=2000 && fvar(37)=0 && fvar(38)!=1600
triggerall=P2BodyDist X>=70 && P2BodyDist X<210
triggerall=Abs(P2Dist Y)<65
trigger1=Random<45+AILevel*8
value=1600

[State -1, AI range technique 1400]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && P2BodyDist X>=0 && P2StateType!=L
triggerall=Power>=1000 && fvar(37)=0 && fvar(38)!=1400
triggerall=P2BodyDist X>=55 && P2BodyDist X<190
triggerall=Abs(P2Dist Y)<65
trigger1=Random<45+AILevel*8
value=1400

[State -1, AI range technique 1500]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && P2BodyDist X>=0 && P2StateType!=L
triggerall=Power>=1000 && fvar(37)=0 && fvar(38)!=1500
triggerall=P2BodyDist X>=20 && P2BodyDist X<105
triggerall=Abs(P2Dist Y)<65
trigger1=Random<45+AILevel*8
value=1500

[State -1, AI range technique 1200]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && P2BodyDist X>=0 && P2StateType!=L
triggerall=Power>=0 && fvar(37)=0 && fvar(38)!=1200
triggerall=P2BodyDist X>=0 && P2BodyDist X<85
triggerall=P2StateType=A
trigger1=Random<45+AILevel*8
value=1200

[State -1, AI range technique 1000]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && P2BodyDist X>=0 && P2StateType!=L
triggerall=Power>=0 && fvar(37)=0 && fvar(38)!=1000
triggerall=P2BodyDist X>=65 && P2BodyDist X<200
triggerall=Abs(P2Dist Y)<65
trigger1=Random<45+AILevel*8
value=1000

[State -1, AI range technique 1100]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && P2BodyDist X>=0 && P2StateType!=L
triggerall=Power>=0 && fvar(37)=0 && fvar(38)!=1100
triggerall=P2BodyDist X>=20 && P2BodyDist X<80
triggerall=Abs(P2Dist Y)<65
trigger1=Random<45+AILevel*8
value=1100

[State -1, AI range technique 1300]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && P2BodyDist X>=0 && P2StateType!=L
triggerall=Power>=0 && fvar(37)=0 && fvar(38)!=1300
triggerall=P2BodyDist X>=45 && P2BodyDist X<130
triggerall=Abs(P2Dist Y)<65
trigger1=Random<45+AILevel*8
value=1300

[State -1, AI air contact]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType=A
trigger1=Abs(P2BodyDist X)<65 && Abs(P2Dist Y)<55 && Random<300
value=600

[State -1, AI close family]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && P2BodyDist X>=0 && P2StateType!=L
trigger1=P2BodyDist X<58 && Random<250+AILevel*35
value=ifelse(GameTime%90<30,200,ifelse(GameTime%90<60,210,220))

[State -1, AI ground approach]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && StateType!=A && P2BodyDist X>=0 && P2StateType!=L
trigger1=P2BodyDist X>80 && P2MoveType!=A && Random<120+AILevel*15
value=100
