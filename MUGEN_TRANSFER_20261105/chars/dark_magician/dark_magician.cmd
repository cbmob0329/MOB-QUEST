[Remap]
x=x
y=y
z=z
a=a
b=b
c=c
s=s
[Defaults]
command.time = 15
command.buffer.time = 3

[Command]
name = "holdfwd"
command = /$F
time = 1
buffer.time = 1

[Command]
name = "holdback"
command = /$B
time = 1
buffer.time = 1

[Command]
name = "holdup"
command = /$U
time = 1
buffer.time = 1

[Command]
name = "holddown"
command = /$D
time = 1
buffer.time = 1

[Command]
name = "FF"
command = $F,$F
time = 10
buffer.time = 3

[Command]
name = "BB"
command = $B,$B
time = 10
buffer.time = 3

[Command]
name = "recovery"
command = x+y
time = 1
buffer.time = 3

[Command]
name = "throw"
command = x+y
time = 1
buffer.time = 3

[Command]
name = "x"
command = x
time = 1
buffer.time = 3

[Command]
name = "y"
command = y
time = 1
buffer.time = 3

[Command]
name = "z"
command = z
time = 1
buffer.time = 3

[Command]
name = "a"
command = a
time = 1
buffer.time = 3

[Command]
name = "b"
command = b
time = 1
buffer.time = 3

[Command]
name = "c"
command = c
time = 1
buffer.time = 3

[Command]
name = "s"
command = s
time = 1
buffer.time = 3

[Statedef -1]

[State -1, U 11170]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 10 && ((StateNo >= 200 && StateNo <= 222) || (StateNo >= 400 && StateNo <= 422) || (StateNo >= 600 && StateNo <= 622)))
triggerall = Power >= 2000
triggerall = var(24) = 0
triggerall = StateType != A
trigger1 = AILevel = 0
trigger1 = command = "c"
trigger1 = command = "holddown"
value = 11170

[State -1, U 11160]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 10 && ((StateNo >= 200 && StateNo <= 222) || (StateNo >= 400 && StateNo <= 422) || (StateNo >= 600 && StateNo <= 622)))
triggerall = Power >= 2000
triggerall = var(24) = 0
triggerall = StateType != A
trigger1 = AILevel = 0
trigger1 = command = "c"
trigger1 = command != "holddown"
value = 11160

[State -1, U 11150]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 10 && ((StateNo >= 200 && StateNo <= 222) || (StateNo >= 400 && StateNo <= 422) || (StateNo >= 600 && StateNo <= 622)))
triggerall = Power >= 1000
triggerall = var(24) = 0
triggerall = StateType != A
trigger1 = AILevel = 0
trigger1 = command = "b"
trigger1 = 1
value = 11150

[State -1, U 11140]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 10 && ((StateNo >= 200 && StateNo <= 222) || (StateNo >= 400 && StateNo <= 422) || (StateNo >= 600 && StateNo <= 622)))
triggerall = Power >= 1000
triggerall = var(24) = 0
triggerall = Pos Y >= -20
trigger1 = AILevel = 0
trigger1 = command = "a"
trigger1 = Pos Y >= -20
value = 11140

[State -1, S 11120]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 10 && ((StateNo >= 200 && StateNo <= 222) || (StateNo >= 400 && StateNo <= 422) || (StateNo >= 600 && StateNo <= 622)))
triggerall = var(24) = 0
triggerall = var(11) = 0 && StateType != A
triggerall = command != "throw"
trigger1 = AILevel = 0
trigger1 = command = "y"
trigger1 = command = "holdback"
value = 11120

[State -1, S 11130]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 10 && ((StateNo >= 200 && StateNo <= 222) || (StateNo >= 400 && StateNo <= 422) || (StateNo >= 600 && StateNo <= 622)))
triggerall = var(24) = 0
triggerall = var(13) = 0
triggerall = command != "throw"
trigger1 = AILevel = 0
trigger1 = command = "y"
trigger1 = command = "holdfwd"
value = 11130

[State -1, S 11110]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 10 && ((StateNo >= 200 && StateNo <= 222) || (StateNo >= 400 && StateNo <= 422) || (StateNo >= 600 && StateNo <= 622)))
triggerall = var(24) = 0
triggerall = Pos Y >= -20
triggerall = command != "throw"
trigger1 = AILevel = 0
trigger1 = command = "z"
trigger1 = command = "holdfwd"
value = 11110

[State -1, S 11100]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 10 && ((StateNo >= 200 && StateNo <= 222) || (StateNo >= 400 && StateNo <= 422) || (StateNo >= 600 && StateNo <= 622)))
triggerall = var(24) = 0
triggerall = Pos Y >= -20 && NumHelper(12100) < 2
triggerall = command != "throw"
trigger1 = AILevel = 0
trigger1 = command = "x"
trigger1 = command = "holdfwd"
value = 11100

[State -1, one finite throw]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 10 && ((StateNo >= 200 && StateNo <= 222) || (StateNo >= 400 && StateNo <= 422) || (StateNo >= 600 && StateNo <= 622)))
triggerall = var(24) = 0
triggerall = var(16) = 0 || var(14) < 4
triggerall = P2BodyDist X < 28
triggerall = Abs(P2Dist Y) < 45
trigger1 = AILevel = 0
trigger1 = command = "throw"
value = 11200

[State -1, actual second jump]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl
triggerall = StateType = A
triggerall = Pos Y < -12
triggerall = var(18) = 0
trigger1 = var(25) = 1
trigger1 = AILevel = 0
trigger2 = AILevel = 0
trigger2 = var(29) > 0
trigger2 = StateNo = 50 && MoveType = I
trigger2 = HitPauseTime = 0
value = 45

[State -1, physical FF dash]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl
triggerall = StateType != A
trigger1 = AILevel = 0
trigger1 = command = "FF"
value = 100

[State -1, physical BB retreat]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl
triggerall = StateType != A
trigger1 = AILevel = 0
trigger1 = command = "BB"
value = 105

[State -1, ground jump]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl
triggerall = StateType != A
trigger1 = AILevel = 0
trigger1 = var(25) = 1
value = 40

[State -1, stance normal x]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl
triggerall = var(24) = 0
trigger1 = AILevel = 0
trigger1 = command = "x"
value = ifelse(StateType = A,600,ifelse(command = "holddown",400,200))

[State -1, stance normal y]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl
triggerall = var(24) = 0
trigger1 = AILevel = 0
trigger1 = command = "y"
value = ifelse(StateType = A,610,ifelse(command = "holddown",410,210))

[State -1, stance normal z]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl
triggerall = var(24) = 0
trigger1 = AILevel = 0
trigger1 = command = "z"
value = ifelse(StateType = A,620,ifelse(command = "holddown",420,220))

[State -1, normal backward guard]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl
triggerall = P2MoveType = A
triggerall = Abs(P2BodyDist X) < 125
trigger1 = AILevel = 0
trigger1 = command = "holdback"
value = 120

; AI finish v1: range-bounded existing moves, no new skills or aerial AI.

[State -1, AI timed high low defense]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=Ctrl && InGuardDist && P2BodyDist X>=0
triggerall=fvar(36)>=10-floor(AILevel/2)
trigger1=P2MoveType=A && Random<400+AILevel*60
value=ifelse(StateType=A,132,ifelse(P2StateType=C,131,130))

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=200 && MoveContact && Time>=8
value=201

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=201 && MoveContact && Time>=8
value=202

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=210 && MoveContact && Time>=8
value=211

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=211 && MoveContact && Time>=8
value=212

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=220 && MoveContact && Time>=8
value=221

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=221 && MoveContact && Time>=8
value=222

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=400 && MoveContact && Time>=8
value=401

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=401 && MoveContact && Time>=8
value=402

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=410 && MoveContact && Time>=8
value=411

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=411 && MoveContact && Time>=8
value=412

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=420 && MoveContact && Time>=8
value=421

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=421 && MoveContact && Time>=8
value=422

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=600 && MoveContact && Time>=8
value=601

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=601 && MoveContact && Time>=8
value=602

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=610 && MoveContact && Time>=8
value=611

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=611 && MoveContact && Time>=8
value=612

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=620 && MoveContact && Time>=8
value=621

[State -1, AI normal confirm]
type=ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && AILevel>0 && NumEnemy>0
triggerall=var(24)=0
trigger1=StateNo=621 && MoveContact && Time>=8
value=622
[State -1, AI bounded rear warp evade]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = NumEnemy > 0
triggerall = AILevel > 0
triggerall = StateType != A
triggerall = var(24) = 0
triggerall = GameTime % ifelse(AILevel >= 6,4,8) = 0
triggerall = Ctrl
triggerall = P2Dist X > 0
triggerall = P2MoveType = A
triggerall = P2BodyDist X < 55
triggerall = Abs(P2Dist Y) < 60
triggerall = var(13) = 0
triggerall = GameTime % 48 >= 32 && GameTime % 48 < 40
trigger1 = 1
value = 11130

[State -1, AI front projectile barrier]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = NumEnemy > 0
triggerall = AILevel > 0
triggerall = StateType != A
triggerall = var(24) = 0
triggerall = GameTime % ifelse(AILevel >= 6,4,8) = 0
triggerall = Ctrl
triggerall = P2Dist X > 0
triggerall = P2MoveType = A
triggerall = P2BodyDist X >= 65 && P2BodyDist X <= 160
triggerall = Abs(P2Dist Y) < 60
triggerall = var(11) = 0
triggerall = NumHelper(12120) = 0
triggerall = GameTime % 48 = 24
trigger1 = 1
value = 11120

[State -1, AI close confirmed prison]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = NumEnemy > 0
triggerall = AILevel > 0
triggerall = StateType != A
triggerall = var(24) = 0
triggerall = GameTime % ifelse(AILevel >= 6,4,8) = 0
triggerall = Ctrl || (MoveHit && Time >= 10 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = P2Dist X > 0
triggerall = var(16) = 0 || var(14) < 4
triggerall = Power >= 2000
triggerall = P2BodyDist X < 40
triggerall = Abs(P2Dist Y) < 30
triggerall = P2StateType != A
triggerall = P2MoveType != A
triggerall = MoveHit || GameTime % 48 < 24
triggerall = fvar(37)=0 && fvar(38)!=11170
trigger1 = 1
value = 11170

[State -1, AI distinct wide barrage zoning]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = NumEnemy > 0
triggerall = AILevel > 0
triggerall = StateType != A
triggerall = var(24) = 0
triggerall = GameTime % ifelse(AILevel >= 6,4,8) = 0
triggerall = Ctrl || (MoveHit && Time >= 10 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = P2Dist X > 0
triggerall = var(16) = 0 || var(14) < 4
triggerall = Power >= 2000
triggerall = NumHelper(12160) < 2
triggerall = P2BodyDist X >= 95 && P2BodyDist X <= 190
triggerall = Abs(P2Dist Y) < 35
triggerall = P2StateType != A
triggerall = P2MoveType != A
triggerall = GameTime % 96 >= 48
triggerall = fvar(37)=0 && fvar(38)!=11160
trigger1 = 1
value = 11160

[State -1, AI distinct slow core zoning]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = NumEnemy > 0
triggerall = AILevel > 0
triggerall = StateType != A
triggerall = var(24) = 0
triggerall = GameTime % ifelse(AILevel >= 6,4,8) = 0
triggerall = Ctrl || (MoveHit && Time >= 10 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = P2Dist X > 0
triggerall = var(16) = 0 || var(14) < 4
triggerall = Power >= 1000
triggerall = var(31) = 0 || Power >= 3000
triggerall = NumHelper(12150) < 2
triggerall = P2BodyDist X >= 45 && P2BodyDist X <= 90
triggerall = Abs(P2Dist Y) < 30
triggerall = P2StateType != A
triggerall = P2MoveType != A
triggerall = GameTime % 48 < 24
triggerall = fvar(37)=0 && fvar(38)!=11150
trigger1 = 1
value = 11150

[State -1, AI eight impact BLACK MAGIC]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = NumEnemy > 0
triggerall = AILevel > 0
triggerall = StateType != A
triggerall = var(24) = 0
triggerall = GameTime % ifelse(AILevel >= 6,4,8) = 0
triggerall = Ctrl || (MoveHit && Time >= 10 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = P2Dist X > 0
triggerall = var(16) = 0 || var(14) < 4
triggerall = Power >= 1000
triggerall = var(31) = 0 || Power >= 3000
triggerall = NumHelper(12140) = 0
triggerall = Pos Y >= -20
triggerall = P2BodyDist X >= 50 && P2BodyDist X <= 250
triggerall = Abs(P2Dist Y) < 45
triggerall = P2MoveType != A
triggerall = fvar(37)=0 && fvar(38)!=11140
trigger1 = 1
value = 11140

[State -1, AI ground launcher route]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = NumEnemy > 0
triggerall = AILevel > 0
triggerall = StateType != A
triggerall = var(24) = 0
triggerall = GameTime % ifelse(AILevel >= 6,4,8) = 0
triggerall = Ctrl || (MoveHit && Time >= 10 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = P2Dist X > 0
triggerall = var(16) = 0 || var(14) < 4
triggerall = Pos Y >= -20
triggerall = NumHelper(12110) < 2
triggerall = P2StateType != A
triggerall = P2MoveType != A
triggerall = P2BodyDist X >= 30 && P2BodyDist X <= 75
triggerall = Abs(P2Dist Y) < 20
triggerall = MoveHit || GameTime % 48 >= 24
triggerall = fvar(37)=0 && fvar(38)!=11110
trigger1 = 1
value = 11110

[State -1, AI bounded magic shot]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = NumEnemy > 0
triggerall = AILevel > 0
triggerall = StateType != A
triggerall = var(24) = 0
triggerall = GameTime % ifelse(AILevel >= 6,4,8) = 0
triggerall = Ctrl || (MoveHit && Time >= 10 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = P2Dist X > 0
triggerall = var(16) = 0 || var(14) < 4
triggerall = Pos Y >= -20
triggerall = NumHelper(12100) < 2
triggerall = P2BodyDist X >= 65 && P2BodyDist X <= 110
triggerall = Abs(P2Dist Y) < 40
triggerall = fvar(37)=0 && fvar(38)!=11100
trigger1 = 1
value = 11100

[State -1, AI close normal families]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = NumEnemy > 0
triggerall = AILevel > 0
triggerall = StateType != A
triggerall = var(24) = 0
triggerall = GameTime % ifelse(AILevel >= 6,4,8) = 0
triggerall = Ctrl
triggerall = P2Dist X > 0
triggerall = var(16) = 0 || var(14) < 4
triggerall = P2BodyDist X <= 18
triggerall = Abs(P2Dist Y) < 35
trigger1 = 1
value = ifelse(GameTime % 96 < 32,200,ifelse(GameTime % 96 < 64,210,220))

[State -1, AI approach outside magic reach]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = NumEnemy > 0
triggerall = AILevel > 0
triggerall = StateType != A
triggerall = var(24) = 0
triggerall = GameTime % ifelse(AILevel >= 6,4,8) = 0
triggerall = Ctrl
triggerall = P2Dist X > 0
triggerall = P2BodyDist X > 18
triggerall = P2MoveType != A
trigger1 = 1
value = 100
