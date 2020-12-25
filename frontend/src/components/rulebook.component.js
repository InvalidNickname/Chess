import React from "react";

class RuleBook extends React.Component {

    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this)
        this.scrollDown = this.scrollDown.bind(this)
        this.scrollUp = this.scrollUp.bind(this)
        this.assistant = props.assistant
    }

    goBack() {
        this.props.history.push("/")
        this.assistant.sendData({action: {action_id: "return_to_start"}})
    }

    scrollUp() {
        document.getElementById('rules-text').scrollTop -= 150;
    }

    scrollDown() {
        document.getElementById('rules-text').scrollTop += 150;
    }

    render() {
        return (
            <div>
                <button onClick={this.goBack}>
                    Назад
                </button>
                <div className="rules-text" id="rules-text">
                    <p className="subtitle">Как ходят фигуры</p>
                    <img src={"/images/kw.svg"} alt="" draggable="false"/>
                    <img src={"/images/kb.svg"} alt="" draggable="false"/>
                    <br/>
                    Король — самая важная фигура, но при этом и одна из самых слабых. Король может ходить только на одно
                    поле в любом направлении: вверх, вниз, в стороны и по диагонали. Когда король атакован другой
                    фигурой, это называется «шах».
                    <br/>
                    <img src={"/images/qw.svg"} alt="" draggable="false"/>
                    <img src={"/images/qb.svg"} alt="" draggable="false"/>
                    <br/>
                    Ферзь — самая сильная фигура. Он может ходить по прямой в любом направлении — вперёд, назад, в
                    стороны или по диагонали на любое число полей, но при этом он не может перепрыгивать через другие
                    фигуры.
                    <br/>
                    <img src={"/images/rw.svg"} alt="" draggable="false"/>
                    <img src={"/images/rb.svg"} alt="" draggable="false"/>
                    <br/>
                    Ладья может ходить на любое число полей, но только вперёд, назад и в стороны (не по диагонали).
                    <br/>
                    <img src={"/images/bw.svg"} alt="" draggable="false"/>
                    <img src={"/images/bb.svg"} alt="" draggable="false"/>
                    <br/>
                    Слон может ходить на любое число полей, соединенных углами по диагонали. Каждому слону доступна
                    только половина полей доски (одного цвета, белого или черного).
                    <br/>
                    <img src={"/images/nw.svg"} alt="" draggable="false"/>
                    <img src={"/images/nb.svg"} alt="" draggable="false"/>
                    <br/>
                    Кони ходят иначе, чем другие фигуры — на два поля в одном направлении и далее на одно поле под углом
                    90 градусов, буквой «Г». Конь — единственная фигура, способная перепрыгивать через другие фигуры.
                    <br/>
                    <img src={"/images/pw.svg"} alt="" draggable="false"/>
                    <img src={"/images/pb.svg"} alt="" draggable="false"/>
                    <br/>
                    Ходить пешка может лишь вперёд, а брать — лишь по диагонали. Пешка может передвигаться только на
                    одно поле за ход, но еще не ходившая пешка может пойти вперёд на одно или два поля. Пешка может
                    брать только по диагонали на одно поле перед собой. Пешка не может ходить или брать назад.
                    <p className="subtitle">Первый ход</p>
                    Шахматист, играющий белыми, всегда ходит первым
                    <p className="subtitle">Победа</p>
                    Цель игры — поставить мат королю соперника. На доске мат, когда один из игроков не может защититься
                    от шаха. Защититься от шаха можно тремя способами:
                    <br/>
                    отступить на другое поле
                    <br/>
                    закрыться от шаха другой фигурой
                    <br/>
                    или взять фигуру, напавшую на короля
                    <p className="subtitle">Рокировка</p>
                    Совершая рокировку, игрок перемещает своего короля на два поля по направлению к ладье, затем эта
                    ладья занимает на поле, которое король только что пересек. Рокировку можно выполнить только при
                    соблюдении следующих условий:
                    <br/>
                    до рокировки король ни разу не ходил
                    <br/>
                    ладья, совершающая рокировку, ни разу не ходила
                    <br/>
                    между королём и ладьёй нет других фигур
                </div>
            </div>
        )
    }

}

export default RuleBook