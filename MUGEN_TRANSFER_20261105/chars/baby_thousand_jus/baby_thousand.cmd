; Dragon self-authored inputs; no foreign choreography.
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
name = "recovery"
command = x+y
time = 1
buffer.time = 1

[Command]
name = "start"
command = s
time = 1
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

[Command]
name = "FF"
command = F,F
time = 10
buffer.time = 3

[Command]
name = "BB"
command = B,B
time = 10
buffer.time = 3

[Command]
name = "super_a"
command = D,DF,F,D,DF,F,x
time = 28
buffer.time = 3

[Command]
name = "super_b"
command = D,DB,B,D,DB,B,y
time = 28
buffer.time = 3

[Statedef -1]
[State -1, Close directional ground air throw]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && var(11) = 1
triggerall = Ctrl && MoveType != H && HitPauseTime = 0 && StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(42) = 800
trigger2 = AILevel > 0 && NumEnemy > 0 && P2MoveType != H
trigger2 = (P2BodyDist X = [0,18]) && Abs(P2Dist Y) < 30
trigger2 = var(30) >= 24-AILevel && Random < 15+AILevel*3
value = 800
ctrl = 0


[State -1, CPU approved move 4700]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = Ctrl && StateType != A && Pos Y = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = Power >= 2000 && var(30) >= 24-AILevel
triggerall = (P2BodyDist X = [15,230]) && Abs(P2Dist Y) < 55
trigger1 = Random < 8+AILevel*2
value = 4700
ctrl = 0


[State -1, CPU approved move 4600]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = Ctrl && StateType != A && Pos Y = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = Power >= 2000 && var(30) >= 24-AILevel
triggerall = (P2BodyDist X = [15,190]) && Abs(P2Dist Y) < 55
trigger1 = Random < 8+AILevel*2
value = 4600
ctrl = 0


[State -1, CPU approved move 4500]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = Ctrl && StateType != A && Pos Y = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = Power >= 1000 && var(30) >= 24-AILevel
triggerall = (P2BodyDist X = [15,100]) && Abs(P2Dist Y) < 55
trigger1 = Random < 8+AILevel*2
value = 4500
ctrl = 0


[State -1, CPU approved move 4400]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = Ctrl && StateType != A && Pos Y = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = Power >= 1000 && var(30) >= 24-AILevel
triggerall = (P2BodyDist X = [15,160]) && Abs(P2Dist Y) < 55
trigger1 = Random < 8+AILevel*2
value = 4400
ctrl = 0


[State -1, CPU approved move 4300]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = Ctrl && StateType != A && Pos Y = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = Power >= 0 && var(30) >= 24-AILevel
triggerall = (P2BodyDist X = [15,60]) && Abs(P2Dist Y) < 55
trigger1 = Random < 15+AILevel*2
value = 4300
ctrl = 0


[State -1, CPU approved move 4200]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = Ctrl && StateType != A && Pos Y = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = Power >= 0 && var(30) >= 24-AILevel
triggerall = (P2BodyDist X = [15,120]) && Abs(P2Dist Y) < 55
triggerall = var(56) = 0
trigger1 = Random < 15+AILevel*2
value = 4200
ctrl = 0


[State -1, CPU approved move 4100]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = Ctrl && StateType != A && Pos Y = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = Power >= 0 && var(30) >= 24-AILevel
triggerall = (P2BodyDist X = [15,45]) && Abs(P2Dist Y) < 55
trigger1 = Random < 15+AILevel*2
value = 4100
ctrl = 0


[State -1, CPU approved move 4000]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = Ctrl && StateType != A && Pos Y = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = Power >= 0 && var(30) >= 24-AILevel
triggerall = (P2BodyDist X = [15,100]) && Abs(P2Dist Y) < 55
trigger1 = Random < 15+AILevel*2
value = 4000
ctrl = 0


[State -1, CPU same normal stage and budget 1200]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = StateType = A
trigger1 = Ctrl && var(30) >= 18-AILevel
trigger1 = (P2BodyDist X = [0,28]) && Abs(P2Dist Y) < 45
trigger1 = Random < 35+AILevel*12
trigger2 = StateNo = 1200 && var(12) < 2 && MoveHit > 0 && Time = 10
value = 1200
ctrl = 0


[State -1, CPU same normal stage and budget 1100]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = StateType != A && Pos Y = 0
trigger1 = Ctrl && var(30) >= 18-AILevel
trigger1 = (P2BodyDist X = [0,28]) && Abs(P2Dist Y) < 45
trigger1 = Random < 35+AILevel*12
trigger2 = StateNo = 1100 && var(12) < 2 && MoveHit > 0 && Time = 10
value = 1100
ctrl = 0


[State -1, CPU same normal stage and budget 1000]
type = ChangeState
triggerall = AILevel > 0 && RoundState = 2 && Alive && var(11) = 1
triggerall = !IsHelper && MoveType != H && HitPauseTime = 0
triggerall = NumEnemy > 0 && (EnemyNear, Alive) && P2StateType != L
triggerall = var(20) = 0 || (var(21) < 4 && (EnemyNear, ID) = var(22))
triggerall = StateType != A && Pos Y = 0
trigger1 = Ctrl && var(30) >= 18-AILevel
trigger1 = (P2BodyDist X = [0,28]) && Abs(P2Dist Y) < 45
trigger1 = Random < 35+AILevel*12
trigger2 = StateNo = 1000 && var(12) < 2 && MoveHit > 0 && Time = 10
value = 1000
ctrl = 0



[State -1, Baseline 1200 three-hit normal chain]
type = ChangeState
triggerall = AILevel = 0 && var(11) = 1
triggerall = RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0 && !IsHelper
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
triggerall = var(42) = 1200
trigger1 = Ctrl
trigger2 = StateNo = 1200 && var(12) < 2 && MoveHit > 0 && Time = [10,18]
value = 1200
ctrl = 0


[State -1, Baseline 1100 three-hit normal chain]
type = ChangeState
triggerall = AILevel = 0 && var(11) = 1
triggerall = RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0 && !IsHelper
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
triggerall = var(42) = 1100
trigger1 = Ctrl
trigger2 = StateNo = 1100 && var(12) < 2 && MoveHit > 0 && Time = [10,18]
value = 1100
ctrl = 0


[State -1, Baseline 1000 three-hit normal chain]
type = ChangeState
triggerall = AILevel = 0 && var(11) = 1
triggerall = RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0 && !IsHelper
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
triggerall = var(42) = 1000
trigger1 = Ctrl
trigger2 = StateNo = 1000 && var(12) < 2 && MoveHit > 0 && Time = [10,18]
value = 1000
ctrl = 0

[State -1, U4 back plus b grounded two bar skyfall]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2 && Alive && Life > 0 && var(11) = 1
triggerall = (Ctrl || ((StateNo = 1000 || StateNo = 1100 || StateNo = 1200) && var(12) = 2 && MoveHit > 0 && Time = [10,18])) && StateType != A && Pos Y = 0
triggerall = MoveType != H && HitPauseTime = 0 && !IsHelper
triggerall = Power >= 2000
triggerall = NumHelper(7470) = 0 && NumHelper(7471) = 0 && NumHelper(7472) = 0 && NumHelper(7473) = 0 && NumHelper(7474) = 0 && NumHelper(7475) = 0 && NumHelper(7476) = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 4700
value = 4700
ctrl = 0

[State -1, U3 forward plus b grounded two bar cannon]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2 && Alive && Life > 0 && var(11) = 1
triggerall = (Ctrl || ((StateNo = 1000 || StateNo = 1100 || StateNo = 1200) && var(12) = 2 && MoveHit > 0 && Time = [10,18])) && StateType != A && Pos Y = 0
triggerall = MoveType != H && HitPauseTime = 0 && !IsHelper
triggerall = Power >= 2000
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 4600
value = 4600
ctrl = 0


[State -1, U2 back plus a grounded flight super]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2 && Alive && Life > 0 && var(11) = 1
triggerall = (Ctrl || ((StateNo = 1000 || StateNo = 1100 || StateNo = 1200) && var(12) = 2 && MoveHit > 0 && Time = [10,18])) && StateType != A && Pos Y = 0
triggerall = MoveType != H && HitPauseTime = 0 && !IsHelper
triggerall = Power >= 1000
triggerall = NumHelper(7450) = 0 && NumHelper(7451) = 0 && NumHelper(7452) = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 4500
value = 4500
ctrl = 0


[State -1, U1 forward plus a once-cost super]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2 && Alive && Life > 0 && var(11) = 1
triggerall = (Ctrl || ((StateNo = 1000 || StateNo = 1100 || StateNo = 1200) && var(12) = 2 && MoveHit > 0 && Time = [10,18])) && StateType != A && Pos Y = 0
triggerall = MoveType != H && HitPauseTime = 0 && !IsHelper
triggerall = Power >= 1000 && NumHelper(7440) = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 4400
value = 4400
ctrl = 0


[State -1, S4 settled back middle grounded anti-air]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2 && Alive && Life > 0 && var(11) = 1
triggerall = (Ctrl || ((StateNo = 1000 || StateNo = 1100 || StateNo = 1200) && var(12) = 2 && MoveHit > 0 && Time = [10,18])) && StateType != A && Pos Y = 0
triggerall = MoveType != H && HitPauseTime = 0 && !IsHelper
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 4300
value = 4300
ctrl = 0


[State -1, S3 settled forward middle or S2 hit-only cancel]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2 && Alive && Life > 0 && var(11) = 1
triggerall = MoveType != H && HitPauseTime = 0 && !IsHelper
triggerall = (StateType != A && Pos Y = 0) || (StateType = A && Pos Y < 0)
triggerall = var(56) = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
triggerall = Ctrl || ((StateNo = 1000 || StateNo = 1100 || StateNo = 1200) && var(12) = 2 && MoveHit > 0 && Time = [10,18]) || (StateNo = 4100 && MoveHit > 0 && Time >= 8)
trigger1 = var(42) = 4200
value = 4200
ctrl = 0


[State -1, Approved S2 settled back plus heavy and S1 hit-only cancel]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2 && Alive && Life > 0
triggerall = var(11) = 1
triggerall = StateType != A && Pos Y = 0
triggerall = MoveType != H && HitPauseTime = 0 && !IsHelper
triggerall = Ctrl || ((StateNo = 1000 || StateNo = 1100 || StateNo = 1200) && var(12) = 2 && MoveHit > 0 && Time = [10,18]) || (StateNo = 4000 && MoveHit > 0 && Time >= 9)
trigger1 = var(42) = 4100
value = 4100
ctrl = 0


[State -1, Approved S1 uses existing settled chord direction snapshot]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2 && Alive && Life > 0
triggerall = var(11) = 1
triggerall = (Ctrl || ((StateNo = 1000 || StateNo = 1100 || StateNo = 1200) && var(12) = 2 && MoveHit > 0 && Time = [10,18])) && StateType != A && Pos Y = 0
triggerall = MoveType != H && HitPauseTime = 0 && !IsHelper
trigger1 = var(42) = 4000
value = 4000
ctrl = 0


[State -1, Dragon shared human ordinary back guard]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType != A
triggerall = InGuardDist
triggerall = command = "holdback"
triggerall = command != "holddown"
trigger1 = 1
value = 130
ctrl = 0

[State -1, Dragon shared human low guard]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType != A
triggerall = InGuardDist
triggerall = command = "holdback"
triggerall = command = "holddown"
trigger1 = 1
value = 131
ctrl = 0

[State -1, Dragon shared human air guard]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = A
triggerall = InGuardDist
triggerall = command = "holdback"
trigger1 = 1
value = 132
ctrl = 0

[State -1, Dragon shared CPU visible guard]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = Ctrl
triggerall = StateType != A
triggerall = InGuardDist
triggerall = P2MoveType = A
triggerall = P2StateType != C
triggerall = var(31) > 14 - AILevel
triggerall = var(30) >= 14 - AILevel
triggerall = Random < 180 + AILevel * 85
trigger1 = 1
value = 130
ctrl = 0
triggerall = var(31) >= 14 - AILevel

[State -1, Dragon shared CPU visible low guard]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = Ctrl
triggerall = StateType != A
triggerall = InGuardDist
triggerall = P2MoveType = A
triggerall = P2StateType = C
triggerall = var(31) > 14 - AILevel
triggerall = var(30) >= 14 - AILevel
triggerall = Random < 180 + AILevel * 85
trigger1 = 1
value = 131
ctrl = 0
triggerall = var(31) >= 14 - AILevel

[State -1, Dragon shared CPU visible air guard]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = Ctrl
triggerall = StateType = A
triggerall = InGuardDist
triggerall = P2MoveType = A
triggerall = var(31) > 14 - AILevel
triggerall = var(30) >= 14 - AILevel
triggerall = Random < 180 + AILevel * 85
trigger1 = 1
value = 132
ctrl = 0
triggerall = var(31) >= 14 - AILevel

[State -1, Dragon shared human one-flight glide]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = A
triggerall = StateNo = 50
triggerall = var(48) = 0
triggerall = var(42) = 70
trigger1 = 1
value = 70
ctrl = 0

[State -1, Dragon shared CPU visible descending glide request]
type = VarSet
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = EnemyNear, Alive
triggerall = Ctrl
triggerall = StateType = A
triggerall = StateNo = 50
triggerall = var(48) = 0
triggerall = var(30) >= 14 - AILevel
triggerall = Vel Y > 1
triggerall = P2Dist X = [20,70]
triggerall = P2Dist Y = [-20,30]
triggerall = Random < 20 + AILevel * 10
trigger1 = 1
v = 42
value = 70

[State -1, Dragon shared CPU same-gate glide]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = Ctrl
triggerall = StateType = A
triggerall = StateNo = 50
triggerall = var(48) = 0
triggerall = var(42) = 70
trigger1 = 1
value = 70
ctrl = 0

[State -1, S4 hit-only real-floor pursuit jump token]
type = VarSet
triggerall = !IsHelper && RoundState = 2 && Alive && var(11) = 1
triggerall = MoveType != H && HitPauseTime = 0
triggerall = StateNo = 4300 && MoveHit > 0 && Time = [24,32]
triggerall = StateType != A && Pos Y = 0
triggerall = var(38) = 0 && var(42) = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && (var(34) = 1 || var(57) > 0)
trigger2 = AILevel > 0 && NumEnemy > 0 && P2StateType = A && Time = 24
v = 47
value = 1

[State -1, Third ground normal hit-only pursuit jump token]
type = VarSet
triggerall = !IsHelper && RoundState = 2 && Alive && var(11) = 1
triggerall = MoveType != H && HitPauseTime = 0
triggerall = (StateNo = 1000 || StateNo = 1100) && var(12) = 2 && MoveHit > 0 && Time = [10,18]
triggerall = StateType != A && Pos Y = 0
triggerall = var(38) = 0 && var(42) = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && (var(34) = 1 || var(57) > 0)
trigger2 = AILevel > 0 && NumEnemy > 0 && P2StateType = A && Time = 10
v = 47
value = 1

[State -1, JUS human ground token]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = VarSet
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = Ctrl
triggerall = MoveType != H
triggerall = var(38) = 0
triggerall = var(42) = 0
triggerall = AILevel = 0
triggerall = StateType != A
triggerall = Pos Y = 0
triggerall = var(34) = 1
triggerall = StateNo = 0 || StateNo = 11 || StateNo = 20 || StateNo = 21 || StateNo = 100
trigger1 = 1
v = 47
value = 1

[State -1, JUS human ground jump]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = ChangeState
triggerall = var(11) = 1
trigger1 = var(47) = 1
value = 40
ctrl = 0

[State -1, JUS human air token]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = VarSet
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = Ctrl
triggerall = MoveType != H
triggerall = var(38) = 0
triggerall = var(42) = 0
triggerall = StateType = A
triggerall = StateNo = 50
triggerall = var(32) = 0
triggerall = Pos Y <= -Const(movement.airjump.height)
triggerall = AILevel = 0
triggerall = var(57) > 0
trigger1 = 1
v = 47
value = 2

[State -1, JUS human air jump]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = ChangeState
triggerall = var(11) = 1
trigger1 = var(47) = 2
value = 45
ctrl = 0

[State -1, JUS CPU air token]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = VarSet
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = Ctrl
triggerall = MoveType != H
triggerall = var(38) = 0
triggerall = var(42) = 0
triggerall = StateType = A
triggerall = StateNo = 50
triggerall = var(32) = 0
triggerall = Pos Y <= -Const(movement.airjump.height)
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = EnemyNear, Alive
triggerall = var(30) >= 14 - AILevel
triggerall = P2Dist X = [35,110]
triggerall = P2Dist Y < -20
triggerall = Random < 10 + AILevel * 8
trigger1 = 1
v = 47
value = 2

[State -1, JUS CPU air jump]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = ChangeState
triggerall = var(11) = 1
trigger1 = var(47) = 2
value = 45
ctrl = 0

[State -1, Dragon shared human run]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = command = "FF"
trigger1 = 1
value = 100
ctrl = 0

[State -1, Dragon shared human backstep]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = command = "BB"
trigger1 = 1
value = 105
ctrl = 0

[State -1, Dragon shared CPU approach]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = StateNo != 100
triggerall = var(30) >= 14 - AILevel
triggerall = P2BodyDist X > 28
triggerall = P2MoveType != A
trigger1 = 1
value = 100
ctrl = 0

[State -1, Dragon shared CPU ground jump]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = var(30) >= 14 - AILevel
triggerall = P2StateType = A
triggerall = P2Dist Y < -20
triggerall = P2BodyDist X = [20,100]
triggerall = Random < 30 + AILevel * 20
trigger1 = 1
value = 700
ctrl = 0
triggerall = !Ctrl || Time >= 4
triggerall = !IsHelper
triggerall = HitPauseTime = 0

[State -1, Dragon shared human taunt]
type = ChangeState
triggerall = var(11) = 1
triggerall = RoundState = 2
triggerall = Alive
triggerall = Life > 0
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = command = "start"
trigger1 = 1
value = 195
ctrl = 0
