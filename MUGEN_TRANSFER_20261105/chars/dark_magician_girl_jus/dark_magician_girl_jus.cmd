[Defaults]
command.time = 1
command.buffer.time = 1

[Command]
name = "x"
command = x
time = 1

[Command]
name = "y"
command = y
time = 1

[Command]
name = "z"
command = z
time = 1

[Command]
name = "a"
command = a
time = 1

[Command]
name = "b"
command = b
time = 1

[Command]
name = "c"
command = c
time = 1

[Command]
name = "holdF"
command = /$F
time = 1

[Command]
name = "holdB"
command = /$B
time = 1

[Command]
name = "holdU"
command = /$U
time = 1

[Command]
name = "holdD"
command = /$D
time = 1

[Command]
name = "holdfwd"
command = /$F
time = 1

[Command]
name = "holdback"
command = /$B
time = 1

[Command]
name = "holdup"
command = /$U
time = 1

[Command]
name = "holddown"
command = /$D
time = 1

[Command]
name = "FF"
command = F,F
time = 10

[Command]
name = "BB"
command = B,B
time = 10

[Command]
name = "recovery"
command = x+y
time = 10

[Command]
name = "jump"
command = $U
time = 1


[Command]
name = "xy"
command = x+y
time = 1

[Command]
name = "yz"
command = y+z
time = 1

[Command]
name = "xz"
command = x+z
time = 1

[Statedef -1]

[State -1, approved route 3300]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 8 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = NumHelper(9000) = 0
triggerall = Power >= 2000
triggerall = StateType != A
triggerall = (EnemyNear, StateType != A) || var(21) < 4
trigger1 = AILevel = 0 && (command = "holdD" && command = "holdF" && command = "xz")
trigger2 = AILevel > 0 && (P2MoveType = H && P2BodyDist X < 190) && Random < 60
value = 3300

[State -1, approved route 3200]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 8 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = NumHelper(9000) = 0
triggerall = Power >= 2000
triggerall = StateType != A
triggerall = (EnemyNear, StateType != A) || var(21) < 4
trigger1 = AILevel = 0 && (command = "holdD" && command = "holdF" && command = "yz")
trigger2 = AILevel > 0 && (P2MoveType = H && P2BodyDist X > 40 && P2BodyDist X < 150) && Random < 60
value = 3200

[State -1, approved route 3100]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 8 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = NumHelper(9000) = 0
triggerall = Power >= 1000
triggerall = StateType != A
triggerall = (EnemyNear, StateType != A) || var(21) < 4
trigger1 = AILevel = 0 && (command = "holdF" && command = "xz")
trigger2 = AILevel > 0 && (P2MoveType = H && P2BodyDist X < 120) && Random < 60
value = 3100

[State -1, approved route 3000]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 8 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = NumHelper(9000) = 0
triggerall = Power >= 1000
triggerall = StateType != A
triggerall = (EnemyNear, StateType != A) || var(21) < 4
trigger1 = AILevel = 0 && (command = "holdF" && command = "yz")
trigger2 = AILevel > 0 && (P2MoveType = H && P2BodyDist X < 140) && Random < 60
value = 3000

[State -1, approved route 1300]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 8 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = NumHelper(9000) = 0
triggerall = Power >= 0
triggerall = StateType != A
triggerall = var(41) = 0
trigger1 = AILevel = 0 && (command = "holdD" && command = "xy")
trigger2 = AILevel > 0 && (P2BodyDist X < 100 && P2MoveType = A) && Random < 95
value = 1300


[State -1, baseline ground air directional throw]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2 && Ctrl
triggerall = NumHelper(9000) = 0
triggerall = NumEnemy > 0
triggerall = StateType != L
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "xy"
trigger1 = command != "holdD" || StateType = A
trigger2 = AILevel > 0 && P2BodyDist X >= 0 && P2BodyDist X < 20
trigger2 = Abs(P2Dist Y) < 30 && P2MoveType != H && Random < 70
value = 800

[State -1, approved route 1200]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 8 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = NumHelper(9000) = 0
triggerall = Power >= 0
triggerall = StateType != A
triggerall = var(42) = 0
trigger1 = AILevel = 0 && (command = "holdB" && command = "y")
trigger2 = AILevel > 0 && (P2BodyDist X < 35 && P2MoveType = A) && Random < 95
value = 1200

[State -1, approved route 1100]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 8 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = NumHelper(9000) = 0
triggerall = Power >= 0
triggerall = StateType != A
trigger1 = AILevel = 0 && (command = "holdD" && command = "z")
trigger2 = AILevel > 0 && (P2BodyDist X < 40 && P2Dist Y < -10) && Random < 95
value = 1100

[State -1, approved route 1000]
type = ChangeState
triggerall = !IsHelper
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && Time >= 8 && (StateNo = 202 || StateNo = 212 || StateNo = 222))
triggerall = NumHelper(9000) = 0
triggerall = Power >= 0
trigger1 = AILevel = 0 && (command = "holdF" && command = "x")
trigger2 = AILevel > 0 && (P2BodyDist X >= 20 && P2BodyDist X < 120) && Random < 95
value = 1000


[State -1, air x start]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = (Ctrl || (StateNo = 100 && Time >= 4)) && StateType = A
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && P2BodyDist X < 16 && P2BodyDist X > -5 && P2Dist Y > -55 && P2Dist Y < 35 && Random < 100
value = 600

[State -1, air x next 2]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 600
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && MoveHit
value = 601

[State -1, air x next 3]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 601
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && MoveHit
value = 602

[State -1, air y start]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = (Ctrl || (StateNo = 100 && Time >= 4)) && StateType = A
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && P2BodyDist X < 16 && P2BodyDist X > -5 && P2Dist Y > -55 && P2Dist Y < 35 && Random < 125
value = 610

[State -1, air y next 2]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 610
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && MoveHit
value = 611

[State -1, air y next 3]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 611
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && MoveHit
value = 612

[State -1, air z start]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = (Ctrl || (StateNo = 100 && Time >= 4)) && StateType = A
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && P2BodyDist X < 16 && P2BodyDist X > -5 && P2Dist Y > -55 && P2Dist Y < 35 && Random < 150
value = 620

[State -1, air z next 2]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 620
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && MoveHit
value = 621

[State -1, air z next 3]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 621
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && MoveHit
value = 622

[State -1, crouching x start]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = (Ctrl || (StateNo = 100 && Time >= 4)) && StateType = C
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && P2BodyDist X < 16 && P2BodyDist X > -5 && P2Dist Y > -55 && P2Dist Y < 35 && Random < 100
value = 400

[State -1, crouching x next 2]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 400
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && MoveHit
value = 401

[State -1, crouching x next 3]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 401
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && MoveHit
value = 402

[State -1, crouching y start]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = (Ctrl || (StateNo = 100 && Time >= 4)) && StateType = C
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && P2BodyDist X < 16 && P2BodyDist X > -5 && P2Dist Y > -55 && P2Dist Y < 35 && Random < 125
value = 410

[State -1, crouching y next 2]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 410
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && MoveHit
value = 411

[State -1, crouching y next 3]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 411
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && MoveHit
value = 413

[State -1, crouching z start]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = (Ctrl || (StateNo = 100 && Time >= 4)) && StateType = C
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && P2BodyDist X < 16 && P2BodyDist X > -5 && P2Dist Y > -55 && P2Dist Y < 35 && Random < 150
value = 420

[State -1, crouching z next 2]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 420
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && MoveHit
value = 421

[State -1, crouching z next 3]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 421
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && MoveHit
value = 422

[State -1, standing x start]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = (Ctrl || (StateNo = 100 && Time >= 4)) && StateType = S
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && P2BodyDist X < 16 && P2BodyDist X > -5 && P2Dist Y > -55 && P2Dist Y < 35 && Random < 100
value = 200

[State -1, standing x next 2]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 200
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && MoveHit
value = 201

[State -1, standing x next 3]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 201
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && MoveHit
value = 202

[State -1, standing y start]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = (Ctrl || (StateNo = 100 && Time >= 4)) && StateType = S
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && P2BodyDist X < 16 && P2BodyDist X > -5 && P2Dist Y > -55 && P2Dist Y < 35 && Random < 125
value = 210

[State -1, standing y next 2]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 210
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && MoveHit
value = 211

[State -1, standing y next 3]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 211
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && MoveHit
value = 212

[State -1, standing z start]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = (Ctrl || (StateNo = 100 && Time >= 4)) && StateType = S
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && P2BodyDist X < 16 && P2BodyDist X > -5 && P2Dist Y > -55 && P2Dist Y < 35 && Random < 150
value = 220

[State -1, standing z next 2]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 220
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && MoveHit
value = 221

[State -1, standing z next 3]
type = ChangeState
triggerall = !IsHelper
triggerall = var(58) = 1
triggerall = Alive && RoundState = 2
triggerall = StateNo = 221
triggerall = MoveContact && Time >= 7 && Time <= 14
triggerall = var(21) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && MoveHit
value = 222

[State -1, forward dash]
type = ChangeState
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = Alive && RoundState = 2 && Ctrl
triggerall = StateType = S
trigger1 = command = "FF"
trigger2 = AILevel > 0 && P2BodyDist X > 90 && Random < 400
value = 100
[State -1, back dash]
type = ChangeState
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = Alive && RoundState = 2 && Ctrl
triggerall = StateType = S
trigger1 = command = "BB"
value = 105
[State -1, guard]
type = ChangeState
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = Alive && RoundState = 2 && Ctrl
triggerall = InGuardDist
trigger1 = command = "holdB"
trigger2 = AILevel > 0 && P2MoveType = A && P2BodyDist X < 80 && Random < 650
value = ifelse(StateType = A,132,ifelse(StateType = C,131,130))
[State -1, second jump]
type = ChangeState
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = Alive && RoundState = 2 && Ctrl
triggerall = StateType = A && var(20) = 0 && var(28) = 1
triggerall = Pos Y < -25
trigger1 = command = "jump"
trigger2 = AILevel > 0 && P2Dist Y < -35 && Vel Y > 0 && Random < 120
value = 45
[State -1, jump]
type = ChangeState
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = Alive && RoundState = 2 && Ctrl
triggerall = StateType != A
trigger1 = command = "jump"
trigger2 = AILevel > 0 && P2Dist Y < -25 && Random < 130
value = 40
[State -1, crouch]
type = ChangeState
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = Alive && RoundState = 2 && Ctrl
triggerall = StateType = S
trigger1 = command = "holdD"
trigger2 = AILevel > 0 && P2BodyDist X < 24 && Random < 90
value = 10
[State -1, forward step]
type = ChangeState
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = Alive && RoundState = 2 && Ctrl
triggerall = StateType = S && StateNo != 20
trigger1 = command = "holdF"
trigger2 = AILevel > 0 && P2BodyDist X > 16
value = 20
[State -1, back step]
type = ChangeState
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = Alive && RoundState = 2 && Ctrl
triggerall = StateType = S && StateNo != 21
trigger1 = command = "holdB"
trigger2 = AILevel > 0 && P2BodyDist X < 12 && Random < 220
value = 21
