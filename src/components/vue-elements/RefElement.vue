
<template>
  <ElementScaffold :uid="element.uid!" ref="root" name="Ref">

    <TerminalScaffold v-for="t in terminals" :id="t.uid" :key="t.uid" />
  </ElementScaffold>
</template>

<script lang="ts" setup>
import { useSceneElement } from '@/utils/Element.util';
import { TerminalDirection, useTerminals } from '@/utils/Terminal.util';
import ElementScaffold from '../elements/ElementScaffold.vue';
import TerminalScaffold from '../elements/TerminalScaffold.vue';

const { element } = useSceneElement()

const { addTerminal, terminals } = useTerminals(element)

addTerminal('Type', TerminalDirection.input)
addTerminal('Default', TerminalDirection.input)
addTerminal('Value', TerminalDirection.input)
addTerminal('Value', TerminalDirection.output)

</script>