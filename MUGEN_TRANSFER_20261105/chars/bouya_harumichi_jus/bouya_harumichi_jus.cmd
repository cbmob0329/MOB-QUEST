[Defaults]
command.time = 12
command.buffer.time = 1

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
name = "recovery"
command = x+y
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
name = "ordinary_throw"
command = x+a
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

[State -1, Reserve skill super throw intent]
type = VarSet
trigger1 = 1
v = 53
value = command = "a" || command = "b" || command = "c" || command = "ordinary_throw"

[State -1, Actual grounded or aerial ordinary throw]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && command = "ordinary_throw"
trigger1 = command != "b" && command != "c" && command != "recovery"
trigger2 = AILevel > 0 && var(20) && var(24) = 2
trigger2 = NumEnemy > 0 && P2Dist X = [0,32]
trigger2 = Abs(P2Dist Y) <= 24
value = 800

[State -1, Approved human 3300]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Power >= 2000
triggerall = command != "ordinary_throw"
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
trigger1 = AILevel = 0
trigger1 = StateType = A && command = "b"
value = 3300

[State -1, Approved human 3200]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Power >= 2000
triggerall = command != "ordinary_throw"
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "c"
value = 3200

[State -1, Approved human 3100]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Power >= 1000
triggerall = command != "ordinary_throw"
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "b" && command = "holddown"
value = 3100

[State -1, Approved human 3000]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Power >= 1000
triggerall = command != "ordinary_throw"
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "b" && command != "holddown"
value = 3000

[State -1, Approved human 1300]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Power >= 0
triggerall = command != "ordinary_throw"
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "a" && command = "holdback" && command != "holddown"
triggerall = command != "b" && command != "c"
value = 1300

[State -1, Approved human 1200]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Power >= 0
triggerall = command != "ordinary_throw"
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "a" && command = "holdfwd" && command != "holdback" && command != "holddown"
triggerall = command != "b" && command != "c"
value = 1200

[State -1, Approved human 1100]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Power >= 0
triggerall = command != "ordinary_throw"
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "a" && command = "holddown"
triggerall = command != "b" && command != "c"
value = 1100

[State -1, Approved human 1000]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Power >= 0
triggerall = command != "ordinary_throw"
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
trigger1 = AILevel = 0
trigger1 = StateType != A && command = "a" && command != "holddown" && command != "holdback" && command != "holdfwd"
triggerall = command != "b" && command != "c"
value = 1000

[State -1, Approved AI 3300]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = AILevel > 0 && var(20)
triggerall = Power >= 2000
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
triggerall = StateType = A
trigger1 = var(24) = 3
value = 3300

[State -1, Approved AI 3200]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = AILevel > 0 && var(20)
triggerall = Power >= 2000
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
triggerall = StateType != A
trigger1 = var(24) = 2
value = 3200

[State -1, Approved AI 3100]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = AILevel > 0 && var(20)
triggerall = Power >= 1000
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
triggerall = StateType != A
trigger1 = var(24) = 1
value = 3100

[State -1, Approved AI 3000]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = AILevel > 0 && var(20)
triggerall = Power >= 1000
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
triggerall = StateType != A
trigger1 = var(24) = 0
value = 3000

[State -1, Approved AI 1300]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = AILevel > 0 && var(20)
triggerall = Power >= 0
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
triggerall = StateType != A
trigger1 = var(24) = 3
value = 1300

[State -1, Approved AI 1200]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = AILevel > 0 && var(20)
triggerall = Power >= 0
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
triggerall = StateType != A
trigger1 = var(24) = 2
value = 1200

[State -1, Approved AI 1100]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = AILevel > 0 && var(20)
triggerall = Power >= 0
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
triggerall = StateType != A
trigger1 = var(24) = 1
value = 1100

[State -1, Approved AI 1000]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = AILevel > 0 && var(20)
triggerall = Power >= 0
triggerall = Ctrl || (MoveHit && (StateNo = [200,622]) && Time >= 6)
triggerall = StateType != A
trigger1 = var(24) = 0
value = 1000

[State -1, A x confirmed stage3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 601
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 602

[State -1, A x confirmed stage2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 600
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 601

[State -1, A x normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger1 = StateType = A
trigger2 = AILevel > 0 && var(20) && var(24) = 4
trigger2 = StateType = A
value = 600

[State -1, A y confirmed stage3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 611
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 612

[State -1, A y confirmed stage2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 610
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 611

[State -1, A y normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger1 = StateType = A
trigger2 = AILevel > 0 && var(20) && var(24) = 5
trigger2 = StateType = A
value = 610

[State -1, A z confirmed stage3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 621
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 622

[State -1, A z confirmed stage2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 620
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 621

[State -1, A z normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger1 = StateType = A
trigger2 = AILevel > 0 && var(20) && var(24) = 6
trigger2 = StateType = A
value = 620

[State -1, C x confirmed stage3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 401
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 402

[State -1, C x confirmed stage2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 400
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 401

[State -1, C x normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger1 = StateType != A && command = "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 4
trigger2 = StateType = C
value = 400

[State -1, C y confirmed stage3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 411
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 412

[State -1, C y confirmed stage2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 410
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 411

[State -1, C y normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger1 = StateType != A && command = "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 5
trigger2 = StateType = C
value = 410

[State -1, C z confirmed stage3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 421
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 422

[State -1, C z confirmed stage2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 420
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 421

[State -1, C z normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger1 = StateType != A && command = "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 6
trigger2 = StateType = C
value = 420

[State -1, S x confirmed stage3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 201
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 202

[State -1, S x confirmed stage2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 200
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger2 = AILevel > 0
value = 201

[State -1, S x normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "x" && command != "recovery"
trigger1 = StateType != A && command != "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 4
trigger2 = StateType = S
value = 200

[State -1, S y confirmed stage3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 211
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 212

[State -1, S y confirmed stage2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 210
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger2 = AILevel > 0
value = 211

[State -1, S y normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "y" && command != "recovery"
trigger1 = StateType != A && command != "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 5
trigger2 = StateType = S
value = 210

[State -1, S z confirmed stage3]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 221
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 222

[State -1, S z confirmed stage2]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = StateNo = 220
triggerall = MoveHit && AnimElemTime(3) >= 0 && AnimTime < 0
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger2 = AILevel > 0
value = 221

[State -1, S z normal start]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
triggerall = Ctrl
trigger1 = AILevel = 0 && var(53) = 0 && command = "z" && command != "recovery"
trigger1 = StateType != A && command != "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 6
trigger2 = StateType = S
value = 220

[State -1, Posture correct guard]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = Ctrl && MoveType != H
triggerall = StateNo != [120,155]
trigger1 = AILevel = 0 && command = "holdback" && InGuardDist
trigger2 = AILevel > 0 && var(21)
value = ifelse(StateType = A,132,ifelse(command = "holddown",131,130))

[State -1, Ground jump]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType != A
trigger1 = AILevel = 0 && command = "jump"
trigger2 = AILevel > 0 && var(23)
value = 40

[State -1, One actual extra airjump]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType = A
triggerall = var(10) = 0 && var(11) = 0
trigger1 = AILevel = 0 && command = "jump"
trigger2 = AILevel > 0 && var(23) && Vel Y > 0
value = 45

[State -1, Fast FF dash]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType != A
trigger1 = AILevel = 0 && command = "FF"
trigger2 = AILevel > 0 && var(22)
value = 100

[State -1, BB retreat]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType != A
trigger1 = AILevel = 0 && command = "BB"
value = 105

[State -1, Human crouch or deliberate AI branch]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType = S
trigger1 = AILevel = 0 && command = "holddown"
trigger2 = AILevel > 0 && var(20) && var(24) = 1
value = 10

[State -1, Human stand]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = MoveType != H
triggerall = StateNo != [120,155]
triggerall = Ctrl && StateType = C
trigger1 = AILevel = 0 && command != "holddown"
trigger2 = AILevel > 0 && !var(20)
value = 12
