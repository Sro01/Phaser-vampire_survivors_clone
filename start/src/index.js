import Phaser, { Scene } from "phaser";
// import logoImg from './assets/logo.png';
import bgImg1 from "./assets/background.png";
import playerImg from "./assets/player.png";

class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        // this.load.image('logo', logoImg);
        this.load.image("background1", bgImg1);
        // this.load.image("player", playerImg);

        /* Player 이미지 쪼개기 */
        this.load.spritesheet("player", playerImg, {
            frameWidth: 32,
            frameHeight: 36,
        });
    }

    create() {
        // const logo = this.add.image(400, 150, "logo");

        // this.tweens.add({
        // targets: logo,
        // y: 450,
        // duration: 2000,
        // ease: "Power2",
        // yoyo: true,
        // loop: -1,
        // });

        this.background1 = this.add.image(0, 0, "background1"); // x좌표, y좌표, 이미지
        this.background1.setOrigin(0, 0); // 이미지의 기준점을 0, 0으로 설정 (브라우저의 왼쪽 위 모서리(0, 0)에 이미지를 로드했기 때문에 이를 기준으로 맞추기 위함)

        this.player = this.add.sprite(
            config.width / 2,
            config.height / 2,
            "player"
        ); // preload()에서 spritesheet로 이미지를 로드한 경우 add.image가 아니라 add.sprite으로 해야 함

        /** 안내 문구 */
        this.add.text(30, 30, "Hello, World!", {
            font: "25px 배달의민족 주아 OTF",
            fill: "#f5e99f",
        });

        /** player 이동 animation */
        this.anims.create({
            key: "player_anim",
            frames: this.anims.generateFrameNumbers("player"), // player 이미지를 프레임으로 사용
            frameRate: 12, // 초당 프레임
            repeat: -1, // -1: 무한대로 반복
        });

        /** player 정지 */
        this.anims.create({
            key: "player_idle",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 0,
            }),
            frameRate: 1,
            repeat: 0,
        });

        /** player_anim 애니메이션 실행 */
        this.player.play("player_idle");

        /** 키보드 입력 받기 */
        this.keyboardInput = this.input.keyboard.createCursorKeys();

        this.player.moving = false;
    }

    update() {
        /** 매 프레임마다 move() 실행 */
        this.move(this.player);
    }

    move(player) {
        /** player 속도 */
        const PLAYER_SPEED = 3;

        /** 키보드 방향키 입력 시 애니메이션 실행 */
        if (
            // 키보드 입력이 있을 때
            this.keyboardInput.left.isDown ||
            this.keyboardInput.right.isDown ||
            this.keyboardInput.up.isDown ||
            this.keyboardInput.down.isDown
        ) {
            if (!player.moving) {
                // player가 움직이고 있지 않다면
                player.play("player_anim"); // 이동 애니메이션 실행
            }
            player.moving = true;
        } else {
            // 키보드 입력이 없을 때
            if (player.moving) {
                // player가 움직이고 있다면
                player.play("player_idle"); // 정지 애니메이션 실행
            }
            player.moving = false;
        }

        /** 키보드 입력에 따라 움직이기*/
        if (this.keyboardInput.left.isDown) {
            player.x -= PLAYER_SPEED;
            player.flipX = false;
        } else if (this.keyboardInput.right.isDown) {
            player.x += PLAYER_SPEED;
            player.flipX = true;
        }
        if (this.keyboardInput.up.isDown) {
            player.y -= PLAYER_SPEED;
        } else if (this.keyboardInput.down.isDown) {
            player.y += PLAYER_SPEED;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    physics: {
        default: "arcade", // arcade라는 물리엔진을 사용
        arcade: {
            debug: process.env.DEBUG === "true",
        },
    },
    scene: MyGame, //   scene: [start, MyGame, ending] 이렇게 여러 scene을 넣어줄 수도 있음
};

const game = new Phaser.Game(config);
