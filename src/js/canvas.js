import platform from '../images/platform.png'
import hills from '../images/hills.png'
import background from '../images/background.png'

const canvas =document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100,
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.widht = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(
            this.position.x, 
            this.position.y, 
            this.widht,
             this.height
        )
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y <= canvas.height) 
        {
            this.velocity.y += gravity
        }
        
    }
}

class Platform {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.widht = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.widht = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}


const platformImage = createImage(platform)

const player = new Player()
const plataforms = [
        new Platform({x: -1, y: 470, image: platformImage}),
        new Platform({x: platformImage.width -2, y: 470, image: platformImage}),
        new Platform({x: platformImage.width *2 +100, y: 470, image: platformImage}),

    ]
const genericObjects = [
    new GenericObject({
        x: -1,
        y: -1,
        image: createImage(background)
    }),
    new GenericObject({
        x: -1,
        y: -1,
        image: createImage(hills)
    }),
]


let scrollOffset = 0;

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(
        genericObjects => {
            genericObjects.draw()
        }
    )

    plataforms.forEach((platform) => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += 5

            plataforms.forEach(platform => {
                platform.position.x -= 5
            })
            genericObjects.forEach(genericObjects => {
                genericObjects.position.x -= 3
            })
     
        } else if (keys.left.pressed) {
            scrollOffset -= 5

            plataforms.forEach(platform => {
                platform.position.x += 5
            })
            genericObjects.forEach(genericObjects => {
                genericObjects.position.x += 3
            })
        }
    }

    plataforms.forEach(platform => {
    // Colisão plataforma
    if (player.position.y + player.height <= platform.position.y && 
        player.position.y + player.height + player.velocity.y >= platform.position.y && 
        player.position.x + player.widht >= platform.position.x &&
        player.position.x <= platform.position.x + platform.widht
        ) 
    {
        player.velocity.y = 0
    }
    })

    if (scrollOffset > 2000) {
        console.log('you venceu')
    }

}

animate()

addEventListener('keydown', ({ keyCode }) => {

    switch (keyCode) {
        case 65:
            keys.left.pressed = true
            break
        case 83:
            player.velocity.y += 20;
            break
        case 68:
            keys.right.pressed = true
            break
        case 87:
            player.velocity.y -= 20;
            break
    }
})

addEventListener('keyup', ({ keyCode }) => {

    switch (keyCode) {
        case 65:
            keys.left.pressed = false
            break
        case 83:
            player.velocity.y = 0;
            break
        case 68:
            keys.right.pressed = false;
            break
        case 87:
            player.velocity.y = 0;
            break
    }
})