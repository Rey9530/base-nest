import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example:'06087d41-5e08-4bf2-ad76-65428c0184aa',
        description:'Producto id',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'Producto Demo',
        description:'titulo del producto',
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example:'415.2',
        description:'Precio del producto',
        default:0
    })
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example:'producto de muchas cosas para que las puedas comprar',
        description:'Descripcion del producto',
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example:'producto_demo',
        description:'Es un identificado del producto',
        uniqueItems:true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example:10,
        description:'Existencia del producto',
        default:0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example:['M','SM','XS'],
        description:'Sizes de la ropa'
    })
    @Column('text',{
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example:'women',
        description:'Para quienes es este producto',
        default:0
    })
    @Column('text')
    gender: string;


    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    // images
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];


    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User


    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug ) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }


}
