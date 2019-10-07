<template>
    <div>
        <h1>Tracklist:</h1>
        <a
            href="javascript:void(0)"
            @click="$store.dispatch('main/setCurrentTrack', 'Enter sandman')"
        >
            <el-card>Enter sandman</el-card>
        </a>
        <a
            href="javascript:void(0)"
            @click="$store.dispatch('main/setCurrentTrack', 'Bleed it out')"
        >
            <el-card>Bleed it out</el-card>
        </a>
        <a
            href="javascript:void(0)"
            @click="$store.dispatch('main/setCurrentTrack', 'bensound-summer')"
        >
            <el-card>bensound-summer</el-card>
        </a>
    </div>
</template>

<script>
export default {};
</script>