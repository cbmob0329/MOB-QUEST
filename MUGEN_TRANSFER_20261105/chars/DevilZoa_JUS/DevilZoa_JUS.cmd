[Remap]
x=x
y=y
z=z
a=a
b=b
c=c
s=s
[Defaults]
command.time=18
command.buffer.time=3

[Command]
name = "holdfwd"
command = /$F
time = 1
buffer.time = 1

[Command]
name = "hold_fwd"
command = /$F
time = 1
buffer.time = 1

[Command]
name = "holdback"
command = /$B
time = 1
buffer.time = 1

[Command]
name = "hold_back"
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
name = "recovery"
command = x+y
time = 1
buffer.time = 1

[Command]
name = "FF"
command = F,F
time = 12
buffer.time = 1

[Command]
name = "BB"
command = B,B
time = 12
buffer.time = 1

[Command]
name = "hold_x"
command = /x
time = 1
buffer.time = 1

[Command]
name = "hold_y"
command = /y
time = 1
buffer.time = 1

[Command]
name = "hold_z"
command = /z
time = 1
buffer.time = 1

[Command]
name = "hold_a"
command = /a
time = 1
buffer.time = 1

[Command]
name = "hold_b"
command = /b
time = 1
buffer.time = 1

[Command]
name = "hold_c"
command = /c
time = 1
buffer.time = 1

[Statedef -1]

[State -1, free once per round metal transformation]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = (Ctrl || (StateNo = 202 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 212 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 222 && MoveHit > 0 && Time >= 11+(var(0)>=2)) || (StateNo = 402 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 412 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 422 && MoveHit > 0 && Time >= 11+(var(0)>=2))) && StateType != A && Pos Y = 0 && var(0) = 0 && var(1) = 0
trigger1 = AILevel = 0 && var(40) = 4300
trigger2 = AILevel > 0 && var(18) > 90 && NumEnemy > 0 && P2BodyDist X > 120 && Random < 20
value = 4300
ctrl = 0


[State -1, approved S2 or S3]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = (Ctrl || (StateNo = 202 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 212 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 222 && MoveHit > 0 && Time >= 11+(var(0)>=2)) || (StateNo = 402 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 412 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 422 && MoveHit > 0 && Time >= 11+(var(0)>=2))) && StateType != A && Pos Y = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 4100
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [15,150]) && var(18) > 30 && Random < 20
value = 4100
ctrl = 0

[State -1, approved S2 or S3]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = (Ctrl || (StateNo = 202 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 212 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 222 && MoveHit > 0 && Time >= 11+(var(0)>=2)) || (StateNo = 402 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 412 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 422 && MoveHit > 0 && Time >= 11+(var(0)>=2))) && StateType != A && Pos Y = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 4200
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [15,45]) && var(18) > 30 && Random < 20
value = 4200
ctrl = 0


[State -1, U1 one bar no fallback]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = (Ctrl || (StateNo = 202 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 212 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 222 && MoveHit > 0 && Time >= 11+(var(0)>=2)) || (StateNo = 402 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 412 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 422 && MoveHit > 0 && Time >= 11+(var(0)>=2))) && StateType != A && Pos Y = 0 && Power >= 1000
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 4500
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [60,210]) && var(18) > 60 && Random < 12
value = 4500
ctrl = 0


[State -1, U2 one bar no normal fallback]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = (Ctrl || (StateNo = 202 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 212 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 222 && MoveHit > 0 && Time >= 11+(var(0)>=2)) || (StateNo = 402 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 412 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 422 && MoveHit > 0 && Time >= 11+(var(0)>=2))) && StateType != A && Pos Y = 0 && Power >= 1000
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 4600
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [10,42]) && var(18) > 45 && Random < 15
value = 4600
ctrl = 0


[State -1, U3 two bars]
type = ChangeState
triggerall = NumHelper(7790) = 0
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = (Ctrl || (StateNo = 202 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 212 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 222 && MoveHit > 0 && Time >= 11+(var(0)>=2)) || (StateNo = 402 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 412 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 422 && MoveHit > 0 && Time >= 11+(var(0)>=2))) && StateType != A && Pos Y = 0 && Power >= 2000
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 4700
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [100,230]) && var(18) > 80 && Random < 10
value = 4700
ctrl = 0


[State -1, U4 two bars no normal fallback]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = (Ctrl || (StateNo = 202 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 212 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 222 && MoveHit > 0 && Time >= 11+(var(0)>=2)) || (StateNo = 402 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 412 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 422 && MoveHit > 0 && Time >= 11+(var(0)>=2))) && StateType != A && Pos Y = 0 && Power >= 2000
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 4800
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [10,42]) && var(18) > 45 && Random < 15
value = 4800
ctrl = 0


[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = Ctrl
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 200
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,60]) && Random < 20
value = 200
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 200 && MoveHit > 0 && Time >= 5+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 201
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,60]) && Random < 20
value = 201
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 201 && MoveHit > 0 && Time >= 6+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 202
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,60]) && Random < 20
value = 202
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = Ctrl
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 210
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,70]) && Random < 20
value = 210
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 210 && MoveHit > 0 && Time >= 7+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 211
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,70]) && Random < 20
value = 211
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 211 && MoveHit > 0 && Time >= 8+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 212
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,70]) && Random < 20
value = 212
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = Ctrl
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 220
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,80]) && Random < 20
value = 220
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 220 && MoveHit > 0 && Time >= 9+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 221
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,80]) && Random < 20
value = 221
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 221 && MoveHit > 0 && Time >= 10+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 222
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,80]) && Random < 20
value = 222
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = Ctrl
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 400
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,60]) && Random < 20
value = 400
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 400 && MoveHit > 0 && Time >= 5+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 401
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,60]) && Random < 20
value = 401
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 401 && MoveHit > 0 && Time >= 6+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 402
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,60]) && Random < 20
value = 402
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = Ctrl
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 410
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,70]) && Random < 20
value = 410
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 410 && MoveHit > 0 && Time >= 7+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 411
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,70]) && Random < 20
value = 411
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 411 && MoveHit > 0 && Time >= 8+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 412
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,70]) && Random < 20
value = 412
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = Ctrl
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 420
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,80]) && Random < 20
value = 420
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 420 && MoveHit > 0 && Time >= 9+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 421
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,80]) && Random < 20
value = 421
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType != A && Pos Y = 0
triggerall = StateNo = 421 && MoveHit > 0 && Time >= 10+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 422
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,80]) && Random < 20
value = 422
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType = A
triggerall = Ctrl
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 600
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,60]) && Random < 20
value = 600
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType = A
triggerall = StateNo = 600 && MoveHit > 0 && Time >= 5+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 601
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,60]) && Random < 20
value = 601
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType = A
triggerall = StateNo = 601 && MoveHit > 0 && Time >= 6+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 602
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,60]) && Random < 20
value = 602
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType = A
triggerall = Ctrl
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 610
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,70]) && Random < 20
value = 610
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType = A
triggerall = StateNo = 610 && MoveHit > 0 && Time >= 7+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 611
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,70]) && Random < 20
value = 611
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType = A
triggerall = StateNo = 611 && MoveHit > 0 && Time >= 8+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 612
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,70]) && Random < 20
value = 612
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType = A
triggerall = Ctrl
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 620
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,80]) && Random < 20
value = 620
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType = A
triggerall = StateNo = 620 && MoveHit > 0 && Time >= 9+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 621
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,80]) && Random < 20
value = 621
ctrl = 0

[State -1, same-button independent three-stage normal route]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = StateType = A
triggerall = StateNo = 621 && MoveHit > 0 && Time >= 10+(var(0)>=2)
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 622
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,80]) && Random < 20
value = 622
ctrl = 0


[State -1, ground or air directional throw no normal fallback]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && Ctrl && MoveType != H && HitPauseTime = 0 && StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 800
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [0,18]) && Abs(P2Dist Y) < 30 && var(18) > 24 && Random < 12
value = 800
ctrl = 0

; APPROVED_CMD_INSERT

[State -1, ground jump]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H
trigger1 = var(47) = 1
value = 40
ctrl = 0

[State -1, extra jump]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H
trigger1 = var(47) = 2
value = 45
ctrl = 0

[State -1, forward dash]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H
trigger1 = Ctrl && StateType != A && command = "FF"
value = 100
ctrl = 0

[State -1, backdash]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H
trigger1 = Ctrl && StateType != A && command = "BB"
value = 105
ctrl = 0

[State -1, guard]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H
trigger1 = Ctrl && StateType != A && command = "holdback" && InGuardDist
value = 130
ctrl = 0

[State -1, airguard]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H
trigger1 = Ctrl && StateType = A && command = "holdback" && InGuardDist
value = 132
ctrl = 0

[State -1, approved S1]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = (Ctrl || (StateNo = 202 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 212 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 222 && MoveHit > 0 && Time >= 11+(var(0)>=2)) || (StateNo = 402 && MoveHit > 0 && Time >= 7+(var(0)>=2)) || (StateNo = 412 && MoveHit > 0 && Time >= 9+(var(0)>=2)) || (StateNo = 422 && MoveHit > 0 && Time >= 11+(var(0)>=2))) && StateType != A && Pos Y = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(40) = 4000
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [30,100]) && var(18) > 18 && Random < 35
value = 4000
ctrl = 0
