
export const vertexShader = /*glsl*/`

    varying float vDisplacement;
    varying vec3 vPosition;
    varying vec2 vUv;

    uniform float u_time;

    float safeDivide(float a, float b) {
        return b != 0.0f ? a / b : 0.0f;
    }

    float mapRangeLinear(float value, float fromMin, float fromMax, float toMin, float toMax, float steps) {
        float factor = safeDivide(value - fromMin, fromMax - fromMin);
        factor = safeDivide(floor(factor * (steps + 1.0f)), steps);
        float result = toMin + factor * (toMax - toMin);
        result = clamp(result, toMin, toMax);
        return result;
    }

    float mod289(const in float x) { return x - floor(x * (1. / 289.)) * 289.; }
    vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
    vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
    vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }

    float permute(const in float x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec2 permute(const in vec2 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec3 permute(const in vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 permute(const in vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float taylorInvSqrt(in float r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec2 taylorInvSqrt(in vec2 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec3 taylorInvSqrt(in vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    vec4 grad4(float j, vec4 ip) {
        const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
        vec4 p,s;
    
        p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
        p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
        s = vec4(lessThan(p, vec4(0.0)));
        p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
    
        return p;
    }

    float snoise(in vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
    
        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
    
        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    
        // Permutations
        i = mod289(i);
        vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;
    
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
    
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
    
        //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
        //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
    
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
    
        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
    
        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
        float density = 1.05;
        float roughness = 1.0;
        
        vUv = uv;
        vPosition = position;

        float factor = snoise(position * density + u_time) * roughness;
        factor = mapRangeLinear(factor, -0.5, 0.8, 0.0, 1.0, 8.0);
        
        vDisplacement = factor;
        vec3 newPosition = position;
        newPosition.z = clamp(position.z + normal.z * vDisplacement, 0.0, 0.15);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    }
`;
export const fragmentShader = /*glsl*/`
    uniform vec2 u_resolution;
    uniform sampler2D albedo;

    varying float vDisplacement;
    varying vec2 vUv;
    varying vec3 vPosition;

    float rand(float x){
        return fract(sin(x)*1.0);
    }

    vec3 colorRampLinear(float t, vec3 startColor, vec3 endColor) {
        return mix(startColor, endColor, t);
    }

    void main() {

        vec2 pixelCoord = gl_FragCoord.xy/u_resolution;
        
        float distance = distance(pixelCoord, vec2(vDisplacement));

        vec3 startColor = vec3(0.1);
        vec3 endColor = vec3(0.85, 0.75, 1.0);
        vec3 interpolatedColor = colorRampLinear(distance, startColor, endColor);

        gl_FragColor = vec4(interpolatedColor, 1.0);
    }
`;
