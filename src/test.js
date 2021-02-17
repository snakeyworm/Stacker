
function intersectRange( r1, r2 ) {

    let min = r1[0] < r2[0]  ? r1 : r2;
    let max = min === r1 ? r2 : r1;

    if ( min[1] < max[0] )
        return null

    return [ max[0], min[1] < max[1] ? min[1] : max[1] ];
    
}

console.log( intersectRange( [ 2, 4, ], [] ) );
console.log( intersectRange( [ 2, 4, ], [ 3, 5, ] ) );
console.log( intersectRange( [ 3, 4 ], [ 4, 5 ] ) );
