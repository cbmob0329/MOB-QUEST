; Full move-set CMD. Engine testing remains with the user.
[Remap]
x = x
y = y
z = z
a = a
b = b
c = c
s = s
[Defaults]
command.time = 12
command.buffer.time = 2

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
name = "jump"
command = $U
time = 1
buffer.time = 1

[Command]
name = "a"
command = a
time = 12
buffer.time = 3

[Command]
name = "b"
command = b
time = 12
buffer.time = 3

[Command]
name = "c"
command = c
time = 12
buffer.time = 3

[Command]
name = "special_forward"
command = /$F,a
time = 12
buffer.time = 3

[Command]
name = "special_down"
command = /$D,a
time = 12
buffer.time = 3

[Command]
name = "special_up"
command = /$U,a
time = 12
buffer.time = 3

[Command]
name = "special_back"
command = /$B,a
time = 12
buffer.time = 3

[Command]
name = "rush_pair"
command = x+y
time = 12
buffer.time = 3

[Command]
name = "counter_pair"
command = y+z
time = 12
buffer.time = 3

[Command]
name = "air_pair"
command = x+z
time = 12
buffer.time = 3
[Command]
name = "clinch_pair"
command = x+a
time = 8
buffer.time = 1

[Command]
name = "recovery"
command = x+y
time = 1
buffer.time = 1

[Statedef -1]

[State -1, Reserve human super intent before cost gate]
type = VarSet
trigger1 = 1
v = 53
value = command = "b" || command = "c" || command = "rush_pair" || command = "counter_pair" || command = "air_pair" || command = "clinch_pair"

[State -1, AI ground clinch]
type = ChangeState
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = RoundState = 2
triggerall = Alive
triggerall = AILevel > 0
triggerall = Ctrl
triggerall = var(41) < 4
triggerall = NumEnemy > 0
triggerall = P2Dist X = [0,32]
triggerall = Abs(P2Dist Y) <= 24
trigger1 = var(20) && var(24) = 2
value = 800


[State -1, Ground clinch pair]
type = ChangeState
triggerall = command != "recovery"
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = RoundState = 2
triggerall = Alive
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = var(41) < 4
triggerall = NumEnemy > 0
trigger1 = command = "clinch_pair"
value = 800


[State -1, Approved human 3300]
type = ChangeState
triggerall = command != "recovery"
triggerall = var(41) < 4
triggerall = MoveType != H
triggerall = StateNo != [150,155]
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 201,5,ifelse(StateNo = 200 || StateNo = 202,4,3))) >= 0 && ((StateNo = [200,222]) || (StateNo = [400,422]) || (StateNo = [600,622])))
triggerall = AILevel = 0
triggerall = Power >= 2000
triggerall = StateType = A
trigger1 = command = "b" || command = "air_pair"
value = 3300
ctrl = 0

[State -1, Approved human 3200]
type = ChangeState
triggerall = command != "recovery"
triggerall = var(41) < 4
triggerall = MoveType != H
triggerall = StateNo != [150,155]
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 201,5,ifelse(StateNo = 200 || StateNo = 202,4,3))) >= 0 && ((StateNo = [200,222]) || (StateNo = [400,422]) || (StateNo = [600,622])))
triggerall = AILevel = 0
triggerall = Power >= 2000
triggerall = StateType != A
trigger1 = command = "c" || command = "counter_pair"
value = 3200
ctrl = 0

[State -1, Approved human 3100]
type = ChangeState
triggerall = command != "recovery"
triggerall = var(41) < 4
triggerall = MoveType != H
triggerall = StateNo != [150,155]
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 201,5,ifelse(StateNo = 200 || StateNo = 202,4,3))) >= 0 && ((StateNo = [200,222]) || (StateNo = [400,422]) || (StateNo = [600,622])))
triggerall = AILevel = 0
triggerall = Power >= 1000
triggerall = StateType != A
triggerall = command = "holddown"
trigger1 = command = "b" || command = "rush_pair"
value = 3100
ctrl = 0

[State -1, Approved human 3000]
type = ChangeState
triggerall = command != "recovery"
triggerall = var(41) < 4
triggerall = MoveType != H
triggerall = StateNo != [150,155]
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 201,5,ifelse(StateNo = 200 || StateNo = 202,4,3))) >= 0 && ((StateNo = [200,222]) || (StateNo = [400,422]) || (StateNo = [600,622])))
triggerall = AILevel = 0
triggerall = Power >= 1000
triggerall = StateType != A
triggerall = command != "holddown"
trigger1 = command = "b" || command = "rush_pair"
value = 3000
ctrl = 0

[State -1, Approved human 1100]
type = ChangeState
triggerall = var(41) < 4
triggerall = var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 201,5,ifelse(StateNo = 200 || StateNo = 202,4,3))) >= 0 && ((StateNo = [200,222]) || (StateNo = [400,422]) || (StateNo = [600,622])))
triggerall = AILevel = 0
triggerall = StateType != A
trigger1 = command = "holddown" && command = "a"
value = 1100
ctrl = 0

[State -1, Approved human 1200]
type = ChangeState
triggerall = var(41) < 4
triggerall = var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 201,5,ifelse(StateNo = 200 || StateNo = 202,4,3))) >= 0 && ((StateNo = [200,222]) || (StateNo = [400,422]) || (StateNo = [600,622])))
triggerall = AILevel = 0
triggerall = StateType != A
trigger1 = command = "holdfwd" && command = "a"
value = 1200
ctrl = 0

trigger2 = command = "special_up"
[State -1, Approved human 1300]
type = ChangeState
triggerall = var(41) < 4
triggerall = var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 201,5,ifelse(StateNo = 200 || StateNo = 202,4,3))) >= 0 && ((StateNo = [200,222]) || (StateNo = [400,422]) || (StateNo = [600,622])))
triggerall = AILevel = 0
triggerall = StateType != A
trigger1 = command = "holdback" && command = "a"
value = 1300
ctrl = 0

[State -1, Approved human 1000]
type = ChangeState
triggerall = var(41) < 4
triggerall = var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 201,5,ifelse(StateNo = 200 || StateNo = 202,4,3))) >= 0 && ((StateNo = [200,222]) || (StateNo = [400,422]) || (StateNo = [600,622])))
triggerall = AILevel = 0
triggerall = StateType != A
trigger1 = command = "a"
trigger1 = command != "holdfwd" && command != "holddown" && command != "holdback" && command != "holdup"
value = 1000
ctrl = 0

[State -1, AI aerial preparation]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = AILevel > 0 && Ctrl
triggerall = var(20)
triggerall = StateType = S
trigger1 = var(24) = 0
value = 40
ctrl = 0

[State -1, AI low preparation]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = AILevel > 0 && Ctrl
triggerall = var(20)
triggerall = StateType = S
trigger1 = var(24) = 1
value = 10
ctrl = 0

[State -1, Approved AI 3300]
type = ChangeState
triggerall = var(41) < 4
triggerall = Alive && RoundState = 2
triggerall = AILevel > 0 && Ctrl
triggerall = var(20)
triggerall = Power >= 2000
triggerall = StateType = A
trigger1 = var(24) = 0
value = 3300
ctrl = 0

[State -1, Approved AI 3200]
type = ChangeState
triggerall = var(41) < 4
triggerall = Alive && RoundState = 2
triggerall = AILevel > 0 && Ctrl
triggerall = var(21)
triggerall = Power >= 2000
triggerall = StateType != A
triggerall = var(21)
trigger1 = var(24) = 2
value = 3200
ctrl = 0

[State -1, Approved AI 3100]
type = ChangeState
triggerall = var(41) < 4
triggerall = Alive && RoundState = 2
triggerall = AILevel > 0 && Ctrl
triggerall = var(20)
triggerall = Power >= 1000
triggerall = StateType = C
trigger1 = var(24) = 1
value = 3100
ctrl = 0

[State -1, Approved AI 3000]
type = ChangeState
triggerall = var(41) < 4
triggerall = Alive && RoundState = 2
triggerall = AILevel > 0 && Ctrl
triggerall = var(20)
triggerall = Power >= 1000
triggerall = StateType = S
trigger1 = var(24) = 3
value = 3000
ctrl = 0

[State -1, Approved AI 1300]
type = ChangeState
triggerall = var(41) < 4
triggerall = Alive && RoundState = 2
triggerall = AILevel > 0 && Ctrl
triggerall = var(20)
triggerall = StateType = S
trigger1 = var(24) = 2
value = 1300
ctrl = 0

[State -1, Approved AI 1200]
type = ChangeState
triggerall = var(41) < 4
triggerall = Alive && RoundState = 2
triggerall = AILevel > 0 && Ctrl
triggerall = var(20)
triggerall = StateType != A
triggerall = var(23)
trigger1 = 1
value = 1200
ctrl = 0

[State -1, Approved AI 1100]
type = ChangeState
triggerall = var(41) < 4
triggerall = Alive && RoundState = 2
triggerall = AILevel > 0 && Ctrl
triggerall = var(20)
triggerall = StateType = C
trigger1 = var(24) = 1
value = 1100
ctrl = 0

[State -1, Approved AI 1000]
type = ChangeState
triggerall = var(41) < 4
triggerall = Alive && RoundState = 2
triggerall = AILevel > 0 && Ctrl
triggerall = var(20)
triggerall = StateType = S
trigger1 = var(24) = 3
value = 1000
ctrl = 0

[State -1, S x normal]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl && StateType = S
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 0
value = 200
ctrl = 0

[State -1, S x confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 200
triggerall = MoveHit && AnimElemTime(4) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && var(20)
value = 201
ctrl = 0

[State -1, S x confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 201
triggerall = MoveHit && AnimElemTime(5) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && var(20)
value = 202
ctrl = 0

[State -1, C x normal]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl && StateType = C
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 0
value = 400
ctrl = 0

[State -1, C x confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 400
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && var(20)
value = 401
ctrl = 0

[State -1, C x confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 401
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && var(20)
value = 402
ctrl = 0

[State -1, A x normal]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl && StateType = A
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 0
value = 600
ctrl = 0

[State -1, A x confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 600
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && var(20)
value = 601
ctrl = 0

[State -1, A x confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 601
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "x"
trigger2 = AILevel > 0 && var(20)
value = 602
ctrl = 0

[State -1, S y normal]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl && StateType = S
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 1
value = 210
ctrl = 0

[State -1, S y confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 210
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && var(20)
value = 211
ctrl = 0

[State -1, S y confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 211
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && var(20)
value = 212
ctrl = 0

[State -1, C y normal]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl && StateType = C
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 1
value = 410
ctrl = 0

[State -1, C y confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 410
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && var(20)
value = 411
ctrl = 0

[State -1, C y confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 411
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && var(20)
value = 412
ctrl = 0

[State -1, A y normal]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl && StateType = A
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 1
value = 610
ctrl = 0

[State -1, A y confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 610
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && var(20)
value = 611
ctrl = 0

[State -1, A y confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 611
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "y"
trigger2 = AILevel > 0 && var(20)
value = 612
ctrl = 0

[State -1, S z normal]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl && StateType = S
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 2
value = 220
ctrl = 0

[State -1, S z confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 220
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && var(20)
value = 221
ctrl = 0

[State -1, S z confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 221
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && var(20)
value = 222
ctrl = 0

[State -1, C z normal]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl && StateType = C
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 2
value = 420
ctrl = 0

[State -1, C z confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 420
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && var(20)
value = 421
ctrl = 0

[State -1, C z confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 421
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && var(20)
value = 422
ctrl = 0

[State -1, A z normal]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = Ctrl && StateType = A
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 2
value = 620
ctrl = 0

[State -1, A z confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 620
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && var(20)
value = 621
ctrl = 0

[State -1, A z confirmed chain]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = Alive && RoundState = 2
triggerall = StateNo = 621
triggerall = MoveHit && AnimElemTime(3) >= 0
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "z"
trigger2 = AILevel > 0 && var(20)
value = 622
ctrl = 0

[State -1, Posture-correct guarded entry]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = Ctrl && MoveType != H
triggerall = StateNo != [120,155]
trigger1 = AILevel = 0 && command = "holdback" && InGuardDist
trigger2 = AILevel > 0 && var(21)
value = ifelse(StateType = A,132,ifelse(command = "holddown" || (AILevel > 0 && var(25)),131,130))
ctrl = 1

[State -1, Human jump]
type = ChangeState
triggerall = StateNo != [120,155]
triggerall = RoundState = 2
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = command = "jump"
trigger1 = StateType != A
value = 40
[State -1, Human air jump]
type = ChangeState
triggerall = StateNo != [120,155]
triggerall = RoundState = 2
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = command = "jump"
triggerall = var(10) = 0
triggerall = Pos Y < -4
trigger1 = StateType = A
value = 51
[State -1, Human run]
type = ChangeState
triggerall = StateNo != [120,155]
triggerall = RoundState = 2
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = S
trigger1 = command = "FF"
value = 100
[State -1, Human backhop]
type = ChangeState
triggerall = StateNo != [120,155]
triggerall = RoundState = 2
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = S
trigger1 = command = "BB"
value = 105
[State -1, Human crouch]
type = ChangeState
triggerall = StateNo != [120,155]
triggerall = RoundState = 2
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = S
trigger1 = command = "holddown"
value = 10
[State -1, Human stand]
type = ChangeState
triggerall = StateNo != [120,155]
triggerall = RoundState = 2
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = C
trigger1 = command != "holddown" && StateNo != 12
value = 12
[State -1, Human walk]
type = ChangeState
triggerall = RoundState = 2
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = StateNo < 120 || StateNo > 155
triggerall = StateNo != 20 && StateNo != 100
trigger1 = command = "holdfwd"
trigger2 = command = "holdback"
value = 20
; AI uses visible combat state, never command reading or free power/armor.
[State -1, AI approach]
type = ChangeState
triggerall = RoundState = 2
triggerall = AILevel > 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = NumEnemy > 0
triggerall = StateNo != 101
triggerall = P2BodyDist X > 42
triggerall = EnemyNear, MoveType != A
trigger1 = Random < 30 * AILevel
value = 101

[State -1, AI return to standing]
type = ChangeState
triggerall = RoundState = 2
triggerall = AILevel > 0
triggerall = Ctrl
triggerall = StateType = C
triggerall = NumEnemy > 0
trigger1 = P2BodyDist X > 45
value = 12
