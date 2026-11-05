[Defaults]
command.time = 12
command.buffer.time = 4

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
name = "jump"
command = $U
time = 1

[Command]
name = "throw"
command = x+y
time = 1

[Command]
name = "recovery"
command = y+z
time = 1

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
name = "s"
command = s
time = 1

[Statedef -1]

[State -1, Reserve skill super throw command intent]
type = VarSet
trigger1 = 1
v = 53
value = command = "a" || command = "b" || command = "c" || command = "throw"

[State -1, Ground and aerial ordinary throw]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && command = "throw"
trigger2 = AILevel > 0 && var(20) && var(24) = 3
trigger2 = NumEnemy > 0 && P2Dist X = [0,32]
trigger2 = Abs(P2Dist Y) <= 22
value = 800

[State -1, Human eight move 3300]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Power >= 2000
triggerall = command != "throw"
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7) || (MoveHit && ((StateNo = 1000 && var(5) >= 14) || (StateNo = 1200 && Time >= 17)))
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "c" && command = "holdback"
value = 3300

[State -1, Human eight move 3200]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Power >= 2000
triggerall = command != "throw"
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7) || (MoveHit && ((StateNo = 1000 && var(5) >= 14) || (StateNo = 1200 && Time >= 17)))
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "c" && command = "holdfwd" && command != "holdback"
value = 3200

[State -1, Human eight move 3100]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Power >= 1000
triggerall = command != "throw"
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7) || (MoveHit && ((StateNo = 1000 && var(5) >= 14) || (StateNo = 1200 && Time >= 17)))
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "b" && command = "holdback"
value = 3100

[State -1, Human eight move 3000]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Power >= 1000
triggerall = command != "throw"
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7) || (MoveHit && ((StateNo = 1000 && var(5) >= 14) || (StateNo = 1200 && Time >= 17)))
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "b" && command = "holdfwd" && command != "holdback"
value = 3000

[State -1, Human eight move 1300]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Power >= 0
triggerall = command != "throw"
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7)
trigger1 = AILevel = 0
trigger1 = StateType = A && command = "a"
value = 1300

[State -1, Human eight move 1100]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Power >= 0
triggerall = command != "throw"
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7) || (MoveHit && StateNo = 1000 && var(5) >= 14)
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "a" && command = "holddown"
value = 1100

[State -1, Human eight move 1200]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Power >= 0
triggerall = command != "throw"
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7)
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "a" && command = "holdback" && command != "holddown"
value = 1200

[State -1, Human eight move 1000]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Power >= 0
triggerall = command != "throw"
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7)
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "a" && command = "holdfwd" && command != "holdback" && command != "holddown"
value = 1000

[State -1, AI fair delayed move 3200]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = AILevel > 0 && NumEnemy > 0 && var(20)
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7) || (MoveHit && ((StateNo = 1000 && var(5) >= 14) || (StateNo = 1200 && Time >= 17)))
triggerall = Power >= 2000
triggerall = StateType != A
trigger1 = (Abs(P2BodyDist X) = [60,140]) && P2MoveType != A
value = 3200

[State -1, AI fair delayed move 3300]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = AILevel > 0 && NumEnemy > 0 && var(20)
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7) || (MoveHit && ((StateNo = 1000 && var(5) >= 14) || (StateNo = 1200 && Time >= 17)))
triggerall = Power >= 2000
triggerall = StateType != A
trigger1 = (P2Dist X = [0,28]) && Abs(P2Dist Y) < 12
value = 3300

[State -1, AI fair delayed move 3100]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = AILevel > 0 && NumEnemy > 0 && var(20)
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7) || (MoveHit && ((StateNo = 1000 && var(5) >= 14) || (StateNo = 1200 && Time >= 17)))
triggerall = Power >= 1000
triggerall = StateType != A
trigger1 = P2StateType = A && Abs(P2Dist Y) < 55 && P2Dist X = [0,42]
value = 3100

[State -1, AI fair delayed move 3000]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = AILevel > 0 && NumEnemy > 0 && var(20)
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7) || (MoveHit && ((StateNo = 1000 && var(5) >= 14) || (StateNo = 1200 && Time >= 17)))
triggerall = Power >= 1000
triggerall = StateType != A
trigger1 = (P2Dist X = [0,46]) && (P2MoveType = H || MoveHit)
value = 3000

[State -1, AI fair delayed move 1100]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = AILevel > 0 && NumEnemy > 0 && var(20)
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7) || (MoveHit && StateNo = 1000 && var(5) >= 14)
triggerall = Power >= 0
triggerall = StateType != A
trigger1 = P2StateType = A && P2Dist X = [0,42]
value = 1100

[State -1, AI fair delayed move 1200]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = AILevel > 0 && NumEnemy > 0 && var(20)
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7)
triggerall = Power >= 0
triggerall = StateType != A
trigger1 = P2StateType != A && (P2Dist X = [0,64]) && var(24) = 2
value = 1200

[State -1, AI fair delayed move 1000]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = AILevel > 0 && NumEnemy > 0 && var(20)
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7)
triggerall = Power >= 0
triggerall = StateType != A
trigger1 = (P2Dist X = [24,64]) && var(24) = 0
value = 1000

[State -1, AI fair delayed move 1300]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = AILevel > 0 && NumEnemy > 0 && var(20)
triggerall = Ctrl || (MoveHit && ((StateNo = [200,222]) || (StateNo = [400,422]) || StateNo = [600,622]) && Time >= 7)
triggerall = Power >= 0
triggerall = StateType = A
trigger1 = Abs(P2Dist X) < 50 && P2Dist Y > -20
value = 1300

[State -1, A x actual confirmed chain 3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 601
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 602

[State -1, A x actual confirmed chain 2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 600
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 601

[State -1, A x normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger1 = StateType = A
trigger2 = AILevel > 0 && var(20) && var(24) = 0
trigger2 = StateType = A
trigger2 = NumEnemy > 0 && Abs(P2BodyDist X) < 50
value = 600

[State -1, A y actual confirmed chain 3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 611
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 612

[State -1, A y actual confirmed chain 2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 610
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 611

[State -1, A y normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger1 = StateType = A
trigger2 = AILevel > 0 && var(20) && var(24) = 1
trigger2 = StateType = A
trigger2 = NumEnemy > 0 && Abs(P2BodyDist X) < 50
value = 610

[State -1, A z actual confirmed chain 3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 621
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 622

[State -1, A z actual confirmed chain 2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 620
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 621

[State -1, A z normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger1 = StateType = A
trigger2 = AILevel > 0 && var(20) && var(24) = 2
trigger2 = StateType = A
trigger2 = NumEnemy > 0 && Abs(P2BodyDist X) < 50
value = 620

[State -1, C x actual confirmed chain 3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 401
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 402

[State -1, C x actual confirmed chain 2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 400
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 401

[State -1, C x normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger1 = StateType != A && command = "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 0
trigger2 = StateType = C
trigger2 = NumEnemy > 0 && Abs(P2BodyDist X) < 50
value = 400

[State -1, C y actual confirmed chain 3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 411
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 412

[State -1, C y actual confirmed chain 2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 410
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 411

[State -1, C y normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger1 = StateType != A && command = "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 1
trigger2 = StateType = C
trigger2 = NumEnemy > 0 && Abs(P2BodyDist X) < 50
value = 410

[State -1, C z actual confirmed chain 3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 421
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 422

[State -1, C z actual confirmed chain 2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 420
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 421

[State -1, C z normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger1 = StateType != A && command = "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 2
trigger2 = StateType = C
trigger2 = NumEnemy > 0 && Abs(P2BodyDist X) < 50
value = 420

[State -1, S x actual confirmed chain 3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 201
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 202

[State -1, S x actual confirmed chain 2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 200
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 201

[State -1, S x normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger1 = StateType != A && command != "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 0
trigger2 = StateType = S
trigger2 = NumEnemy > 0 && Abs(P2BodyDist X) < 50
value = 200

[State -1, S y actual confirmed chain 3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 211
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 212

[State -1, S y actual confirmed chain 2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 210
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 211

[State -1, S y normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger1 = StateType != A && command != "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 1
trigger2 = StateType = S
trigger2 = NumEnemy > 0 && Abs(P2BodyDist X) < 50
value = 210

[State -1, S z actual confirmed chain 3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 221
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 222

[State -1, S z actual confirmed chain 2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = StateNo = 220
triggerall = MoveHit && Time >= 7 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 221

[State -1, S z normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(42) = 0 || var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger1 = StateType != A && command != "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 2
trigger2 = StateType = S
trigger2 = NumEnemy > 0 && Abs(P2BodyDist X) < 50
value = 220

[State -1, Back input and delayed AI guard]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl
trigger1 = AILevel = 0 && command = "holdback" && InGuardDist
trigger2 = AILevel > 0 && var(21)
value = ifelse(StateType = A,132,ifelse((AILevel = 0 && command = "holddown") || (AILevel > 0 && var(25)),131,130))

[State -1, Ground jump edge]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType != A
triggerall = var(11) = 0
trigger1 = AILevel = 0 && command = "jump"
trigger2 = AILevel > 0 && var(23)
value = 40

[State -1, One release-repress airjump]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType = A
triggerall = var(10) = 0 && var(11) = 0
trigger1 = AILevel = 0 && command = "jump"
trigger2 = AILevel > 0 && var(23) && Vel Y > 0
value = 51

[State -1, Actual finite FF burst]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType != A
trigger1 = AILevel = 0 && command = "FF"
trigger2 = AILevel > 0 && var(20) && var(22)
value = 100

[State -1, Actual BB retreat]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType != A
trigger1 = AILevel = 0 && command = "BB"
value = 105

[State -1, Human crouch and delayed AI low posture]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType = S
trigger1 = AILevel = 0 && command = "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 2
value = 10

[State -1, Stand from crouch]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType = C
trigger1 = AILevel = 0 && command != "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) != 2
value = 12

[State -1, Actual held-direction walk]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType = S
triggerall = StateNo != 20
trigger1 = AILevel = 0 && (command = "holdfwd" || command = "holdback")
trigger1 = command != "holddown"
value = 20
