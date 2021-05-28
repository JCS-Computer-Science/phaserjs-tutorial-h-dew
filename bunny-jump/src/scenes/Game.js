import Phaser from '../lib/phaser.js'

// import the carrot class
import Carrot from '../game/Carrot.js'

export default class Game extends Phaser.Scene
{
    carrotsColledted = 0

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Input.Keyboard.CursorKeys} */
    cursors

    /** @type {Phaser.GameObjects.Text} */
    carrotsCollectedText

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

        this.load.image('carrot', 'assets/carrot.png')

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

        // create a carrot 
        this.carrots = this.physics.add.group({
            classType: Carrot
        })

        this.physics.add.collider(this.platforms, this.carrots)

        
        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot,
            undefined,
            this
        )

        const style = { color: '#000', fontSize: 24 }
        this.carrotsCollectedText = this.add.text(240, 10, 'Carrots: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0)
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

                this.addCarrotAbove(platform)
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
        if (this.cursors.left.isDown && this.cursors.right.isDown && !touchingDown)
        {
            this.player.setVelocityX(0)
        }
        else if (this.cursors.left.isDown && !touchingDown)
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

    /**
     * 
     * @param {Phaser.GameObjects.Sprite} sprite 
     */

    addCarrotAbove(sprite)
    {
        const y = sprite.y - sprite.displayHeight

        /** @type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x, y, 'carrot')

        // set active and visible
        carrot.setActive(true)
        carrot.setVisible(true)

        this.add.existing(carrot)

        carrot.body.setSize(carrot.width, carrot.height)

        this.physics.world.enable(carrot)

        return carrot
    }

    /**
     * @param {Phaser.Physics.Arcade.Sprite} player
     * @param {Carrot} carrot
     */
    handleCollectCarrot(player, carrot)
    {
        // hide from display
        this.carrots.killAndHide(carrot)

        // disable from physics world
        this.physics.world.disableBody(carrot.body)
    }

    /**
     * @param {Phaser.Physics.Arcade.Sprite} player
     * @param {Carrot} carrot
     */
    handleCollectCarrot(player, carrot)
    {
        this.carrots.killAndHide(carrot)

        this.physics.world.disableBody(carrot.body)

        // increment by 1
        this.carrotsCollected++

        // create new text value and set it
        const value = `Carrots: ${this.carrotsCollected}`
        this.carrotsCollectedText.text = value
    }
}

