import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene
{
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    constructor()
    {
        super('game')
    }

    preload()
    {
        this.load.image('background', 'assets/bg_layer1.png')

        // load the platform image
        this.load.image('platform', 'assets/ground_grass.png')

        // loads the player
        this.load.image('bunny-stand','assets/bunny1_stand.png')
    }

    create()
    {
        // add background
        this.add.image(240, 320,'background')

        // create the group
        const platforms = this.physics.add.staticGroup()

        // then create 5 platforms from the group
        for (let i=0; i < 5; ++i)
        {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = platforms.create(x, y, 'platform')
            platform.scale = 0.5

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()
        }

        // creates the player sprite
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
            .setScale(0.5)

        this.physics.add.collider(platforms, this.player)

        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        this.player.body.checkCollision.up = false

        this.cameras.main.startFollow(this.player)
    }

    update()
    {
        // use Arcade Physics to find if player is touching something below it
        const touchingDown = this.player.body.touching.down

        if (touchingDown)
        {
            // this makes the bunny jump straight up
            this.player.setVelocityY(-300)
        }
    }
}

