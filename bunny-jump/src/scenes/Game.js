import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene
{
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Input.Keyboard.CursorKeys} */
    cursors

    constructor()
    {
        super('game')
    }

    preload()
    {
        // loads the background
        this.load.image('background', 'assets/bg_layer1.png')

        // load the platform image
        this.load.image('platform', 'assets/ground_grass.png')

        // loads the player
        this.load.image('bunny-stand','assets/bunny1_stand.png')

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create()
    {
        this.add.image(240, 320, 'background')
            .setScrollFactor(1, 0)

        // add background
        this.add.image(240, 320,'background')

        // create the group
        this.platforms = this.physics.add.staticGroup()

        // then create 5 platforms from the group
        for (let i=0; i < 5; ++i)
        {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.5

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()
        }

        // creates the player sprite
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
            .setScale(0.5)

        this.physics.add.collider(this.platforms, this.player)

        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        this.player.body.checkCollision.up = false

        this.cameras.main.startFollow(this.player)

        this.cameras.main.startFollow(this.player)

        // set the horizontal deadzone to 1.5 times the game width
        this.cameras.main.setDeadzone(this.scale.width *  1.5)
    }

    update()
    {
        //scrolls platforms
        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child

            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700)
            {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
            }
        })


        // use Arcade Physics to find if player is touching something below it
        const touchingDown = this.player.body.touching.down

        if (touchingDown)
        {
            // this makes the bunny jump straight up
            this.player.setVelocityY(-300)
        }

        // movement logic
        if (this.cursors.left.isDown && !touchingDown)
        {
            this.player.setVelocityX(-200)
        }
        else if (this.cursors.right.isDown && ! touchingDown)
        {
            this.player.setVelocityX(200)
        }
        else 
        {
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)
    }

    /**
     * @param {Phaser.GameObjects.Sprite} sprite
     */
    horizontalWrap(sprite)
    {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth)
        {
            sprite.x = gameWidth + halfWidth
        }
        else if (sprite.x > gameWidth + halfWidth)
        {
            sprite.x = -halfWidth
        }
    }
}

