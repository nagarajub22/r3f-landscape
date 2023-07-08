precision mediump float;

uniform vec2 u_resolution;

varying float vDisplacement;


vec3 colorRampLinear(float t, vec3 startColor, vec3 endColor) {
    return mix(startColor, endColor, t);
}

void main() {

    vec2 pixelCoord = gl_FragCoord.xy / u_resolution;

    float distance = distance(pixelCoord, vec2(vDisplacement));

    vec3 startColor = vec3(0.1);
    vec3 endColor = vec3(0.85, 0.75, 1.0);
    vec3 interpolatedColor = colorRampLinear(distance, startColor, endColor);

    gl_FragColor = vec4(interpolatedColor, 1.0);
}