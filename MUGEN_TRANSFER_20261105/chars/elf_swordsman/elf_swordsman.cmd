; ELF v0.3 original inputs. Priority: super > special > hit-confirm > normal.
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
name = "recovery"
command = x+y
time = 1
buffer.time = 1

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
name = "start"
command = s
time = 1
buffer.time = 1

[Command]
name = "super1_x"
command = D,DF,F,D,DF,F,x
time = 28
buffer.time = 3

[Command]
name = "super1_a"
command = D,DF,F,D,DF,F,a
time = 28
buffer.time = 3

[Command]
name = "super2_y"
command = D,DF,F,D,DF,F,y
time = 28
buffer.time = 3

[Command]
name = "super2_b"
command = D,DF,F,D,DF,F,b
time = 28
buffer.time = 3

[Command]
name = "rush_x"
command = D,DF,F,x
time = 18
buffer.time = 3

[Command]
name = "rush_a"
command = D,DF,F,a
time = 18
buffer.time = 3

[Command]
name = "rise_y"
command = F,D,DF,y
time = 18
buffer.time = 3

[Command]
name = "rise_b"
command = F,D,DF,b
time = 18
buffer.time = 3

[Command]
name = "flash_z"
command = D,DF,F,z
time = 18
buffer.time = 3

[Command]
name = "flash_c"
command = D,DF,F,c
time = 18
buffer.time = 3

[Command]
name = "arc_y"
command = D,DB,B,y
time = 18
buffer.time = 3

[Command]
name = "arc_b"
command = D,DB,B,b
time = 18
buffer.time = 3

[Command]
name = "parry_x"
command = D,DB,B,x
time = 18
buffer.time = 3

[Command]
name = "parry_a"
command = D,DB,B,a
time = 18
buffer.time = 3


[Command]
name = "jus_hold_x"
command = /x
time = 1
buffer.time = 1

[Command]
name = "jus_hold_y"
command = /y
time = 1
buffer.time = 1

[Command]
name = "jus_hold_z"
command = /z
time = 1
buffer.time = 1

[Command]
name = "jus_hold_a"
command = /a
time = 1
buffer.time = 1

[Command]
name = "jus_hold_b"
command = /b
time = 1
buffer.time = 1

[Command]
name = "jus_hold_c"
command = /c
time = 1
buffer.time = 1


[Statedef -1]

[State -1, A168 human Bz hilt throw]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 800
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 800
ctrl = 0

[State -1, A168 human shortest 3300]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 3300
trigger1 = Power >= 2000
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = ifelse(StateType = A,3301,3300)
ctrl = 0

[State -1, A168 human shortest 3200]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 3200
trigger1 = Power >= 2000
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 3200
ctrl = 0

[State -1, A168 human shortest 3100]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 3100
trigger1 = Power >= 1000
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 3100
ctrl = 0

[State -1, A168 human shortest 3000]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 3000
trigger1 = Power >= 1000
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 3000
ctrl = 0

[State -1, A168 human shortest 1000]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 1000
trigger1 = Power >= 0
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = NumHelper(18101) < 2
value = 1000
ctrl = 0

[State -1, A168 human shortest 1100]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 1100
trigger1 = Power >= 0
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = StateType != A
trigger1 = Pos Y = 0
value = 1100
ctrl = 0

[State -1, A168 human shortest 1200]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 1200
trigger1 = Power >= 0
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = StateType != A
trigger1 = Pos Y = 0
value = 1200
ctrl = 0

[State -1, A168 human shortest 1300]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 1300
trigger1 = Power >= 0
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = StateType != A
trigger1 = Pos Y = 0
value = 1300
ctrl = 0

[State -1, A168 normal S 0]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 200
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12000
ctrl = 0

[State -1, A168 normal S 1]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 210
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12010
ctrl = 0

[State -1, A168 normal S 2]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 220
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12020
ctrl = 0

[State -1, A168 normal C 0]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 400
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12100
ctrl = 0

[State -1, A168 normal C 1]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 410
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12110
ctrl = 0

[State -1, A168 normal C 2]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 420
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12120
ctrl = 0

[State -1, A168 normal A 0]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 600
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12200
ctrl = 0

[State -1, A168 normal A 1]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 610
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12210
ctrl = 0

[State -1, A168 normal A 2]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 620
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12220
ctrl = 0

[State -1, A168 human first jump]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = var(34) = 1
trigger1 = var(42) = 0
value = 40
ctrl = 0

[State -1, A168 human second jump]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = StateNo = 50
trigger1 = StateType = A
trigger1 = var(32) = 0
trigger1 = var(57) > 0
trigger1 = Pos Y <= -Const(movement.airjump.height)
trigger1 = var(42) = 0
value = 45
ctrl = 0

[State -1, A168 actual FF velocity dash]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = StateNo != 100
trigger1 = command = "FF"
trigger1 = var(42) = 0
value = 100
ctrl = 1

[State -1, A168 bounded BB retreat]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = command = "BB"
trigger1 = var(42) = 0
value = 105
ctrl = 0

[State -1, A168 read visible attack guard A]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = A
trigger1 = P2MoveType = A
trigger1 = Abs(P2Dist X) < 70
trigger1 = Abs(P2Dist Y) < 65
trigger1 = var(31) >= 12-AILevel
trigger1 = Random < AILevel*65
value = 132
ctrl = 0

[State -1, A168 read visible attack guard C]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = C
trigger1 = P2MoveType = A
trigger1 = Abs(P2Dist X) < 70
trigger1 = Abs(P2Dist Y) < 65
trigger1 = var(31) >= 12-AILevel
trigger1 = Random < AILevel*65
value = 131
ctrl = 0

[State -1, A168 read visible attack guard S]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = P2MoveType = A
trigger1 = Abs(P2Dist X) < 70
trigger1 = Abs(P2Dist Y) < 65
trigger1 = var(31) >= 12-AILevel
trigger1 = Random < AILevel*65
value = 130
ctrl = 0

[State -1, A168 AI spacing 3200]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = Time >= 3
trigger1 = Power >= 2000
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*7
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2Dist X = [28,56]
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = P2StateType != A
trigger1 = P2StateType != L
trigger1 = Abs(P2Dist Y) < 24
value = 3200
ctrl = 0

[State -1, A168 AI spacing 3100]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = Time >= 3
trigger1 = Power >= 1000
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*7
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2Dist X = [48,76]
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = P2StateType != A
trigger1 = P2StateType != L
trigger1 = Abs(P2Dist Y) < 24
value = 3100
ctrl = 0

[State -1, A168 AI spacing 3000]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = Time >= 3
trigger1 = Power >= 1000
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*7
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2Dist X = [85,175]
trigger1 = P2StateType != L
trigger1 = Abs(P2Dist Y) < 32
trigger1 = NumHelper(18301) + NumHelper(18302) + NumHelper(18303) = 0
value = 3000
ctrl = 0

[State -1, A168 AI spacing 3300]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = Time >= 3
trigger1 = Power >= 2000
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*7
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2Dist X = [100,200]
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = P2StateType != L
trigger1 = Abs(P2Dist Y) < 40
trigger1 = NumHelper(18400) = 0
value = 3300
ctrl = 0

[State -1, A168 AI spacing 1200]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = Time >= 3
trigger1 = Power >= 0
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*7
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2StateType = A
trigger1 = P2Dist X = [28,66]
trigger1 = P2Dist Y = [-55,-5]
trigger1 = Pos Y = 0
trigger1 = StateType != A
value = 1200
ctrl = 0

[State -1, A168 AI spacing 1100]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = Time >= 3
trigger1 = Power >= 0
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*7
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2MoveType = A
trigger1 = P2Dist X = [60,145]
trigger1 = P2StateType != A
trigger1 = P2StateType != L
trigger1 = Abs(P2Dist Y) < 20
trigger1 = Pos Y = 0
trigger1 = StateType != A
value = 1100
ctrl = 0

[State -1, A168 AI spacing 1000]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = Time >= 3
trigger1 = Power >= 0
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*7
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2Dist X = [55,150]
trigger1 = Abs(P2Dist Y) < 32
trigger1 = P2StateType != L
trigger1 = NumHelper(18101) < 2
value = 1000
ctrl = 0

[State -1, A168 AI spacing 1300]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = Time >= 3
trigger1 = Power >= 0
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*7
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2MoveType = A
trigger1 = P2Dist X = [0,45]
trigger1 = var(31) > 8
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = Abs(P2Dist Y) < 40
trigger1 = P2StateType != L
value = 1300
ctrl = 0

[State -1, A168 AI public normal S]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = P2Dist X = [0,55]
trigger1 = Abs(P2Dist Y) < 65
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*35
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = ifelse(P2Dist X > 40,12020,ifelse(P2MoveType = H,12010,12000))
ctrl = 0

[State -1, A168 AI public normal C]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = C
trigger1 = P2Dist X = [0,55]
trigger1 = Abs(P2Dist Y) < 65
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*35
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12100
ctrl = 0

[State -1, A168 AI public normal A]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = A
trigger1 = P2Dist X = [0,55]
trigger1 = Abs(P2Dist Y) < 65
trigger1 = var(30) >= 13-AILevel
trigger1 = Random < AILevel*35
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12200
ctrl = 0

[State -1, A168 AI visible approach]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = StateNo != 100
trigger1 = MoveType = I
trigger1 = StateNo != [120,155]
trigger1 = P2StateType != A
trigger1 = P2StateType != L
trigger1 = FrontEdgeBodyDist > 1
trigger1 = P2Dist X > 55
trigger1 = var(30) > 6
value = 100
ctrl = 1

[State -1, A168 AI retreat]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = P2Dist X < 18
trigger1 = P2MoveType = A
trigger1 = var(31) > 8
trigger1 = Random < AILevel*10
value = 105
ctrl = 0

[State -1, A168 AI jump chase]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = P2StateType = A
trigger1 = P2Dist Y < -35
trigger1 = Random < AILevel*10
value = 40
ctrl = 0

[State -1, A168 AI secondjump]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = var(58) = 1
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateNo = 50
trigger1 = var(32) = 0
trigger1 = Pos Y <= -Const(movement.airjump.height)
trigger1 = P2StateType = A
trigger1 = P2Dist Y < -20
trigger1 = Random < AILevel*7
value = 45
ctrl = 0
